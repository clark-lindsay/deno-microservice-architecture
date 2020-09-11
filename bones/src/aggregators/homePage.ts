import { postgres, QueryResult } from "../../deps.ts";
import { MessageStore, IncomingMessage } from "../messageStore/index.ts";

export function createHomePageAggregator({
  db,
  messageStore,
}: {
  db: Promise<postgres.Client>;
  messageStore: MessageStore;
}) {
  const queries = createQueries({ db });
  const handlers = createHandlers({ queries });
  const subscription = messageStore.createSubscription({
    streamName: "viewing",
    handlers,
    subscriberId: "aggregators:home-page",
  });

  async function start() {
    const initResponse = await init();
    subscription.start();
  }

  function init() {
    return queries.ensureHomePage();
  }

  return {
    queries,
    handlers,
    start,
  };
}

function createQueries({ db }: { db: Promise<postgres.Client> }) {
  async function ensureHomePage(): Promise<QueryResult> {
    const pageData = {
      lastViewProcessed: 0,
      videosWatched: 0,
    };
    const initializePageRow = `
		INSERT INTO
			pages(page_name, page_data)
		VALUES
			('home', '${JSON.stringify(pageData)}')
		ON CONFLICT DO NOTHING
		`;

    const client = await db;
    return client.query(initializePageRow);
  }

  async function incrementVideosWatched(
    globalPosition: number
  ): Promise<QueryResult> {
    const query = `
		UPDATE
			pages
		SET
		page_data = jsonb_set(
			page_data,
			'{videosWatched}',
			((page_data ->> 'videosWatched')::int + 1)::text::jsonb
		),
		'{lastViewProcessed}',
		${globalPosition}::text::jsonb
	)
	WHERE
	page_name = 'home' AND
	(page_data ->> 'lastViewProcessed')::int < ${globalPosition}
		`;

    const client = await db;
    return client.query(query);
  }
  return {
    ensureHomePage,
    incrementVideosWatched,
  };
}

function createHandlers({ queries }: { queries: any }) {
  return {
    VideoViewed: (event: IncomingMessage) =>
      queries.incrementVideosWatched(event.globalPosition),
  };
}
