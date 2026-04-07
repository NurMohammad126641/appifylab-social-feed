import { CreatePostForm } from "@/components/feed/create-post-form";
import { LogoutButton } from "@/components/feed/logout-button";
import { ModeToggle } from "@/components/feed/mode-toggle";
import { PostCard } from "@/components/feed/post-card";
import type { FeedPost } from "@/lib/feed";
import { formatFullName } from "@/lib/utils";

type FeedShellProps = {
  currentUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  posts: FeedPost[];
};

const suggestedPeople = [
  { name: "Steve Jobs", role: "CEO of Apple", image: "/assets/images/people1.png" },
  { name: "Ryan Roslansky", role: "CEO of Linkedin", image: "/assets/images/people2.png" },
  { name: "Dylan Field", role: "CEO of Figma", image: "/assets/images/people3.png" },
];

const storyCards = [
  { image: "/assets/images/card_ppl1.png", label: "Your Story", mini: false },
  { image: "/assets/images/card_ppl2.png", label: "Ryan Roslansky", mini: true },
  { image: "/assets/images/card_ppl3.png", label: "Dylan Field", mini: true },
  { image: "/assets/images/card_ppl4.png", label: "Steve Jobs", mini: true },
];

export function FeedShell({ currentUser, posts }: FeedShellProps) {
  const fullName = formatFullName(currentUser.firstName, currentUser.lastName);

  return (
    <div className="_layout _layout_main_wrapper">
      <ModeToggle />
      <div className="_main_layout">
        <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
          <div className="container _custom_container">
            <div className="_logo_wrap">
              <a className="navbar-brand" href="/feed">
                <img src="/assets/images/logo.svg" alt="Buddy Script" className="_nav_logo" />
              </a>
            </div>
            <button
              className="navbar-toggler bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <div className="_header_form ms-auto">
                <form className="_header_form_grp">
                  <svg className="_header_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                    <circle cx="7" cy="7" r="6" stroke="#666" />
                    <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                  </svg>
                  <input
                    className="form-control me-2 _inpt1"
                    type="search"
                    placeholder="Search posts or people"
                    aria-label="Search"
                  />
                </form>
              </div>
              <div className="_app_nav_profile ms-auto">
                <img src="/assets/images/profile.png" alt={fullName} className="_app_nav_avatar" />
                <div className="_app_nav_profile_text">
                  <strong>{fullName}</strong>
                  <span>{currentUser.email}</span>
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </nav>

        <div className="_layout_inner_wrap">
          <div className="container _custom_container">
            <div className="row _layout_inner_wrap_area">
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_left_sidebar_wrap">
                  <div className="_left_inner_area_explore _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                    <h4 className="_left_inner_area_explore_title _title5  _mar_b24">Explore</h4>
                    <ul className="_left_inner_area_explore_list">
                      <li className="_left_inner_area_explore_item _explore_item">
                        <a href="#0" className="_left_inner_area_explore_link">Learning</a>
                        <span className="_left_inner_area_explore_link_txt">New</span>
                      </li>
                      <li className="_left_inner_area_explore_item">
                        <a href="#0" className="_left_inner_area_explore_link">Insights</a>
                      </li>
                      <li className="_left_inner_area_explore_item">
                        <a href="#0" className="_left_inner_area_explore_link">Bookmarks</a>
                      </li>
                    </ul>
                  </div>

                  <div className="_left_inner_area_suggest _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                    <div className="_left_inner_area_suggest_content _mar_b24">
                      <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
                      <span className="_left_inner_area_suggest_content_txt">
                        <a className="_left_inner_area_suggest_content_txt_link" href="#0">See All</a>
                      </span>
                    </div>
                    {suggestedPeople.map((person) => (
                      <div className="_left_inner_area_suggest_info" key={person.name}>
                        <div className="_left_inner_area_suggest_info_box">
                          <div className="_left_inner_area_suggest_info_image">
                            <img src={person.image} alt={person.name} className="_info_img" />
                          </div>
                          <div className="_left_inner_area_suggest_info_txt">
                            <h4 className="_left_inner_area_suggest_info_title">{person.name}</h4>
                            <p className="_left_inner_area_suggest_info_para">{person.role}</p>
                          </div>
                        </div>
                        <div className="_left_inner_area_suggest_info_link">
                          <a href="#0" className="_info_link">Connect</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_feed_inner_ppl_card _mar_b16">
                    <div className="row">
                      {storyCards.map((story, index) => (
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col" key={`${story.label}-${index}`}>
                          <div
                            className={
                              index === 0
                                ? "_feed_inner_profile_story _b_radious6"
                                : "_feed_inner_public_story _b_radious6"
                            }
                          >
                            <div
                              className={
                                index === 0
                                  ? "_feed_inner_profile_story_image"
                                  : "_feed_inner_public_story_image"
                              }
                            >
                              <img
                                src={story.image}
                                alt={story.label}
                                className={index === 0 ? "_profile_story_img" : "_public_story_img"}
                              />
                              {index === 0 ? (
                                <div className="_feed_inner_story_txt">
                                  <div className="_feed_inner_story_btn">
                                    <button className="_feed_inner_story_btn_link" type="button">+</button>
                                  </div>
                                  <p className="_feed_inner_story_para">{story.label}</p>
                                </div>
                              ) : (
                                <>
                                  <div className="_feed_inner_pulic_story_txt">
                                    <p className="_feed_inner_pulic_story_para">{story.label}</p>
                                  </div>
                                  {story.mini ? (
                                    <div className="_feed_inner_public_mini">
                                      <img src="/assets/images/mini_pic.png" alt="" className="_public_mini_img" />
                                    </div>
                                  ) : null}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <CreatePostForm currentUserName={fullName} />

                  {posts.length ? (
                    posts.map((post) => (
                      <PostCard key={post.id} post={post} currentUserId={currentUser.id} />
                    ))
                  ) : (
                    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16 _app_empty_state">
                      <h4>No posts yet</h4>
                      <p>Create the first post to populate the feed.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_right_sidebar_wrap">
                  <div className="_layout_right_sidebar_inner">
                    <div className="_right_inner_area_info _padd_t24  _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_right_inner_area_info_content _mar_b24">
                        <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
                        <span className="_right_inner_area_info_content_txt">
                          <a className="_right_inner_area_info_content_txt_link" href="#0">See All</a>
                        </span>
                      </div>
                      <hr className="_underline" />
                      <div className="_right_inner_area_info_ppl">
                        <div className="_right_inner_area_info_box">
                          <div className="_right_inner_area_info_box_image">
                            <img src="/assets/images/Avatar.png" alt="Avatar" className="_ppl_img" />
                          </div>
                          <div className="_right_inner_area_info_box_txt">
                            <h4 className="_right_inner_area_info_box_title">Radovan SkillArena</h4>
                            <p className="_right_inner_area_info_box_para">Founder &amp; CEO at Trophy</p>
                          </div>
                        </div>
                        <div className="_right_info_btn_grp">
                          <button type="button" className="_right_info_btn_link">Ignore</button>
                          <button type="button" className="_right_info_btn_link _right_info_btn_link_active">Follow</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="_layout_right_sidebar_inner">
                    <div className="_feed_right_inner_area_card _padd_t24  _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_feed_top_fixed">
                        <div className="_feed_right_inner_area_card_content _mar_b24">
                          <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
                          <span className="_feed_right_inner_area_card_content_txt">
                            <a className="_feed_right_inner_area_card_content_txt_link" href="#0">See All</a>
                          </span>
                        </div>
                        <form className="_feed_right_inner_area_card_form">
                          <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                            <circle cx="7" cy="7" r="6" stroke="#666" />
                            <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                          </svg>
                          <input
                            className="form-control me-2 _feed_right_inner_area_card_form_inpt"
                            type="search"
                            placeholder="input search text"
                            aria-label="Search"
                          />
                        </form>
                      </div>
                      <div className="_feed_bottom_fixed">
                        {suggestedPeople.map((person, index) => (
                          <div
                            className={
                              index % 2 === 0
                                ? "_feed_right_inner_area_card_ppl _feed_right_inner_area_card_ppl_inactive"
                                : "_feed_right_inner_area_card_ppl"
                            }
                            key={`${person.name}-friend`}
                          >
                            <div className="_feed_right_inner_area_card_ppl_box">
                              <div className="_feed_right_inner_area_card_ppl_image">
                                <img src={person.image} alt={person.name} className="_box_ppl_img" />
                              </div>
                              <div className="_feed_right_inner_area_card_ppl_txt">
                                <h4 className="_feed_right_inner_area_card_ppl_title">{person.name}</h4>
                                <p className="_feed_right_inner_area_card_ppl_para">{person.role}</p>
                              </div>
                            </div>
                            <div className="_feed_right_inner_area_card_ppl_side">
                              {index % 2 === 0 ? <span>5 minute ago</span> : <span className="_app_online_dot" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
