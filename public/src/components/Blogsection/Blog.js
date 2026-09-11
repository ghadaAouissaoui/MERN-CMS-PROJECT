import styles from "./Blog.module.css";
import { Link } from "react-router-dom";
import arrow from "../../media/icons8-right-64.png";
import { Fragment } from "react";
import Pagination from "../Pagination/Pagination";
import LoaderThree from "../Loader/LoaderThree";
import PostCategory from "../PostCategory/PostCategory";
import SearchSection from "../Searchpost/SearchSection";

const Blog = (props) => {
  const apiUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:3030";

  let posts = props.posts;
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return apiUrl + imagePath;
  };
  
  return (
    <Fragment>
      <SearchSection searchDataHandler={props.searchDataHandler} />
      <PostCategory
        postCategory={props.postCategory}
        categoryHandler={props.categoryHandler}
      />
      {!props.isLoader && posts.length > 0 && (
        <Fragment>
          <div className={styles["blog-main"]}>
            <div className={styles["wide-post"]}>
              <div className={styles["img"]}>
                <Link
                  to={`/post?title=${posts[0]?.title}&id=${posts[0]?.postId}`}
                >
                  <img
                      className={styles["img-img"]}
                      src={getFullImageUrl(posts[0]?.image)}
                      alt="post img"
                    />
                  <div className={styles["arrow-main"]}>
                  <img
                    className={styles["small-img"]}
                    src={getFullImageUrl(posts?.image)}
                    alt="img"
                  />
                  </div>
                </Link>
              </div>

              <div className={styles["wide-text-section"]}>
                <Link
                  to={`/post?title=${posts[0]?.title}&id=${posts[0]?.postId}`}
                >
                  <p className={styles["cat-name"]}>
                    {posts[0]?.category.name.split(" ")[0]}
                  </p>
                  <h2 className={styles["titie"]}>{posts[0]?.title}</h2>
                  <p className={styles["desc"]}>{posts[0]?.desc}</p>
                  <div className={styles["name-date"]}>
                    <p className={styles["name"]}>{posts[0]?.user.name}</p>
                    <p className={styles["date"]}>{posts[0]?.date}</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className={styles["small-post"]}>
              {posts.slice(1, posts.length).map((data) => (
                <Link
                  to={`/post?title=${data?.title}&id=${data?.postId}`}
                  key={data?.postId}
                >
                  <div className={styles["posts"]}>
                     <img
                      className={styles["small-img"]}
                      src={
                          data?.image.startsWith("http") 
                              ? data?.image 
                              : apiUrl + data?.image
                      }
                      alt={data?.imageName}
                  />
                    <div className={styles["arrow-main-snd"]}>
                      <img
                        className={styles["arrow-snd"]}
                        src={arrow}
                        alt="arrow"
                      ></img>
                    </div>

                    <p className={styles["cat"]}>
                      {data?.category.name.split(" ")[0]}
                    </p>
                    <h3 className={styles["title-two"]}>{data?.title}</h3>
                    <p className={styles["desc-two"]}>{data?.desc}</p>
                    <div
                      className={`${styles["name-date"]} ${styles["name-date-snd"]}`}
                    >
                      <p className={styles["name"]}>{data?.user.name}</p>
                      <p className={styles["date"]}>{data?.date}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <Pagination
            pages={props.pages}
            currentPageHandler={props.currentPageHandler}
          />
        </Fragment>
      )}
      {!props.isLoader && posts.length < 1 && (
        <div className={styles["no-post"]}>
          <p>
            Sorry, no post available at the moment. Stay tuned for updates and
            exciting content soon!
          </p>
        </div>
      )}
      {props.isLoader && (
        <div className={styles["loader"]}>
          <LoaderThree />
        </div>
      )}
    </Fragment>
  );
};

export default Blog;
