import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";


export async function connectDB() {
	const db = await open({
		filename: path.join(__dirname, 'winedrops.db'),
		driver: sqlite3.Database
	})

	return db;
}
