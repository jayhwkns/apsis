// Converts markdown and frontmatter to a json object
import type Apod from "@backend-types/apod";
import matter from "gray-matter";

export default function mdToApod(md: string): Apod {
  const mat = matter(md);
  const apod: Apod = {
    date: mat.data.date,
    title: mat.data.title,
    credits: mat.data.credits,
    copyright: mat.data.copyright,
    description: mat.content,
    imageLink: mat.data.imageLink
  };
  return apod;
}
