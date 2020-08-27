export function up(dexClient: any): void {
  dexClient.schema.createTable("videos", (table: any) => {
    table.increments();
    table.string("owner_id");
    table.string("name");
    table.string("description");
    table.string("transcoding_status");
    table.integer("view_count").defaultsTo(0);
  });
}

export function down(dexClient: any): void {
  dexClient.schema.dropTable("videos");
}
