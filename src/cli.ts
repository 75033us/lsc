#!/usr/bin/env node

import { Command } from "commander";
import { importFromYouTube } from "./commands/import.js";

const program = new Command();

program
  .name("lsc")
  .description("LSC Worship Song Lyrics Library CLI")
  .version("1.0.0");

program
  .command("import <url>")
  .description("Import a song from YouTube URL")
  .action(async (url: string) => {
    try {
      const song = await importFromYouTube(url);
      console.log(JSON.stringify(song, null, 2));
    } catch (error) {
      console.error("Error:", error);
      process.exit(1);
    }
  });

program
  .command("generate")
  .description("Generate slides from a worship file")
  .requiredOption("--template <path>", "Path to PPTX template")
  .requiredOption("--worship <path>", "Path to worship JSON file")
  .action((options) => {
    console.error("Generate command not yet implemented");
    console.error(`Template: ${options.template}`);
    console.error(`Worship: ${options.worship}`);
  });

program
  .command("search <query>")
  .description("Full-text fuzzy search across all song fields")
  .action((query: string) => {
    console.error("Search command not yet implemented");
    console.error(`Query: ${query}`);
  });

program
  .command("list")
  .description("List all songs in the library")
  .action(() => {
    console.error("List command not yet implemented");
  });

program
  .command("history <songId>")
  .description("Query worship history for a song")
  .action((songId: string) => {
    console.error("History command not yet implemented");
    console.error(`Song ID: ${songId}`);
  });

program.parse();
