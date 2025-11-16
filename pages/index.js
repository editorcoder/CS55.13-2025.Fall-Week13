/*
editorcoder
2025-11-15
SRJC CS55.13 Fall 2025
Week 13: Assignment 13: Custom SQL in Headless CMS-Powered App
index.js
*/

import Head from "next/head"; // Import Next.js Head component
import Link from "next/link"; // Import Next.js Link component
import Date from "../components/date"; // Import Date component
import Layout, { siteTitle } from "../components/layout"; // Import shared Layout component and site title
import { getSortedPostsData } from "../lib/posts"; // Import helper to load and sort posts

export default function Home({ allPostsData }) { // Export the Home page component as default
  return (
    // Begin component render
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className="homeIntro">
        <p>
          Hello! I'm <a href="https://github.com/editorcoder" target="_blank">EditorCoder</a>, a subject matter expert (SME) for legal AI
          tech and a fledgling accessible web developer. This site hosts the blog for my upcoming Cat Trading Card Game (TCG). Each post previews details for a card in the game.
        </p>
      </section>

      <section>
        <h2>Cat TCG Blog Posts</h2>
        <div className="blogPosts">
          {allPostsData.map(({ id, title, date }) => (
            <Link key={id} href={`/posts/${id}`}><div className="postCard">
              <h3>{title}</h3>
              <div className="postDate"><Date dateString={date} /></div>
            </div></Link>
          ))}
        </div>
      </section>
    </Layout >
  ); // End render expression
} // End component

export async function getStaticProps() { // Next.js SSG: fetch data at build time
  const allPostsData = await getSortedPostsData(); // Load and sort posts for listing
  return { // Provide props to page
    props: { // Props container
      allPostsData, // Array of posts with id, date, title
    }, // End props
  }; // End return object
}
