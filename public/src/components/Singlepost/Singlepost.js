import React, { Fragment, useEffect, useState } from "react";
import LoaderBig from "../Loader/LoaderBig";
import styles from "./Singlepost.module.css";
import DOMPurify from "dompurify";
// Importez la section de commentaires
import CommentsSection from "./CommentsSection";

const apiUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:3030";

const Singlepost = () => {
  const [postsData, setPostData] = useState({ post: { post: { user: {} } }, createDate: "", updateDate: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const params = new URLSearchParams(window.location.search);
    const title = params.get("title");
    const id = params.get("id");
    if (id) setPostId(id);

    if (title && id) {
      fetch(`${apiUrl}/public/getsinglepost`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, postId: id, timeZone: userTimezone }),
      })
        .then(res => {
          if (!res.ok) throw new Error("no post available");
          return res.json();
        })
        .then(data => {
          setPostData(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, []);

  const sanitizedContent = DOMPurify.sanitize(postsData.post.post.content);

  return (
    <Fragment>
      {isLoading && (
        <div className={styles.loader}>
          <LoaderBig />
        </div>
      )}

      {!isLoading && postsData.post.createDate && (
        <div className={styles["post-main"]}>

          {/* En-tête du post */}
          <div className={styles["post-sub"]}>
            <div className={styles["title-section"]}>
              <div className={styles.title}>
                <h1>{postsData.post.post.title}</h1>
                <p className={styles.desc}>{postsData.post.post.desc}</p>
                <p className={styles.name}>
                  Written by: <span>{postsData.post.post.user.name}</span>
                </p>

                <div className={styles.date}>
                  <p>Published: {postsData.post.createDate}</p>
                  {postsData.post.updateDate && <p>Updated: {postsData.post.updateDate}</p>}
                  <div className={styles.views}>
                    <img
                      width="20"
                      height="20"
                      src="https://img.icons8.com/ios/50/visible--v1.png"
                      alt="views icon"
                    />
                    <p>{postsData.post.post.views}</p>
                  </div>
                </div>
              </div>

              <div className={styles["image-section"]}>
                <img
                  width="500px"
                  height="400px"
                  src={apiUrl + postsData.post.post.image}
                  alt={postsData.post.post.imageName}
                />
                <p>{postsData.post.post.imgSource}</p>
              </div>
            </div>
          </div>

          {/* Contenu du post */}
          <div className={styles["text-section-main"]}>
            <div
              className={styles["text-section"]}
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Section de commentaires sous le contenu */}
            {postId && (
              <div className={styles.commentContainer}>
                <CommentsSection postId={postId} />
              </div>
            )}
          </div>

        </div>
      )}
    </Fragment>
  );
};

export default Singlepost;