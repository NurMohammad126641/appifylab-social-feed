"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

type CreatePostFormProps = {
  currentUserName: string;
};

export function CreatePostForm({ currentUserName }: CreatePostFormProps) {
  const router = useRouter();
  const fileInputId = useId();
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.set("content", content);
      formData.set("visibility", visibility);

      if (file) {
        formData.set("image", file);
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Unable to create post.");
        return;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setContent("");
      setVisibility("PUBLIC");
      setFile(null);
      setPreviewUrl("");
      router.refresh();
    } catch {
      setError("Unable to create post right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="_feed_inner_text_area  _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16"
      onSubmit={handleSubmit}
    >
      <div className="_feed_inner_text_area_box">
        <div className="_feed_inner_text_area_box_image">
          <img src="/assets/images/txt_img.png" alt={currentUserName} className="_txt_img" />
        </div>
        <div className="form-floating _feed_inner_text_area_box_form">
          <textarea
            className="form-control _textarea"
            placeholder="Write something ..."
            id="feed-post-textarea"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />
          <label className="_feed_textarea_label" htmlFor="feed-post-textarea">
            Write something ...
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" fill="none" viewBox="0 0 23 24">
              <path
                fill="#666"
                d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z"
              />
            </svg>
          </label>
        </div>
      </div>
      {previewUrl ? (
        <div className="_app_preview _mar_t20">
          <img src={previewUrl} alt="Selected preview" />
        </div>
      ) : null}
      {error ? <p className="_app_form_error _mar_t12">{error}</p> : null}
      <div className="_app_composer_controls">
        <div className="_feed_inner_text_area_item">
          <div className="_feed_inner_text_area_bottom_photo _feed_common">
            <label htmlFor={fileInputId} className="_feed_inner_text_area_bottom_photo_link _app_file_label">
              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path
                    fill="#666"
                    d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411z"
                  />
                </svg>
              </span>
              Photo
            </label>
            <input
              id={fileInputId}
              className="_app_hidden_input"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                }
                setFile(nextFile);
                setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : "");
              }}
            />
          </div>
          <div className="_feed_inner_text_area_bottom_article _feed_common">
            <label className="_app_visibility_label">
              <span>Visibility</span>
              <select value={visibility} onChange={(event) => setVisibility(event.target.value)}>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </label>
          </div>
        </div>
        <div className="_feed_inner_text_area_btn">
          <button type="submit" className="_feed_inner_text_area_btn_link" disabled={loading}>
            <svg className="_mar_img" xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z"
                clipRule="evenodd"
              />
            </svg>
            <span>{loading ? "Posting..." : "Post"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
