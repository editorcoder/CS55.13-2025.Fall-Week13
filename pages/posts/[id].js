/*
editorcoder
2025-11-15
SRJC CS55.13 Fall 2025
Week 13: Assignment 13: Custom SQL in Headless CMS-Powered App
[id].js
*/

import Head from "next/head"; // Import Next.js Head component
import Image from "next/image"; // Import Next.js Image component for optimized images
import Date from "../../components/date"; // Import Date component
import Layout from "../../components/layout"; // Import shared page layout component
import { getAllPostIds, getPostData } from "../../lib/posts"; // Import custom data helpers for posts
import styles from "./posts.module.css"; // Import custom CSS module for post styles

export default function Post({ postData }) { // Default export of the Post page component
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article className={styles.post}>
        <h2 className={styles.postTitle}>{postData.title}</h2>
        <div className={styles.postDate}>
          <Date dateString={postData.date} />
        </div>
        {(postData.photoUrl || postData.photoSourceUrl) && (
          <div className={styles.postImage}>
            <Image
              src={postData.photoUrl || postData.photoSourceUrl}
              alt={postData.title}
              width={800}
              height={400}
              sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
              className={styles.featuredImage}
            />

          </div>
        )}
        <div className={styles.postDetails}>
          {(postData.cost !== null || postData.attack || postData.defense || postData.lives !== null) && (
            <div className="stats">
              <h3>Stats</h3>
              <ul>
                <li>Cost: {postData.cost}</li>
                {postData.attack && <li>Attack: {postData.attack}</li>}
                {postData.defense && <li>Defense: {postData.defense}</li>}
                {postData.lives !== null && <li>Lives: {postData.lives}</li>}
                {postData.catnip && <li>Catnip: {postData.catnip}</li>}
              </ul>
            </div>
          )}
          {postData.mechanics && (
            <div className="mechanics">
              <h3>Mechanics</h3>
              <p>{postData.mechanics}</p>
            </div>
          )}
          {postData.lore && (
            <div className="lore">
              <h3>Lore</h3>
              <p>{postData.lore}</p>
            </div>
          )}
          {postData.photoArtistName && (
            <div className="credits">
              <h3>Credits</h3>
              <p>
                {postData.photoArtistUrl ? (
                  <a href={postData.photoSourceUrl} target="_blank" rel="noopener noreferrer">
                    Photo
                  </a>
                ) : (
                  postData.photoArtistName
                )}
                {" by "}
                {postData.photoArtistUrl ? (
                  <a href={postData.photoArtistUrl} target="_blank" rel="noopener noreferrer">
                    {postData.photoArtistName}
                  </a>
                ) : (
                  postData.photoArtistName
                )}
              </p>
            </div>
          )}
        </div>
      </article>
    </Layout>
  ); // End return statement
} // End Post component

export async function getStaticPaths() { // Next.js SSG: pre-generate dynamic routes
  const paths = await getAllPostIds(); // Get list of route params like { params: { id } }
  return { // Return paths and fallback behavior for SSG
    paths, // Array of route objects
    fallback: false, // 404 for non-existent paths at build time
  }; // End return object
} // End getStaticPaths



export async function getStaticProps({ params }) { // Fetch data for a specific post
  const postData = await getPostData(params.id); // Load post content by id
  // console.log(postData);
  return { // Provide props to the page component
    props: { // Props container
      postData, // The post data to render
    }, // End props
  }; // End return object
} // End getStaticProps
