import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

// 🔧 Nếu backend của bạn không chạy 3000, đổi lại ở đây
const API_BASE = "http://localhost:7000/api";

const api = axios.create({
  baseURL: API_BASE
});

export default function App() {
  const [tab, setTab] = useState("posts"); // edit | reputation | posts
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");

  // demo profile box (tí nữa nối API Users thì thay)
  const profile = useMemo(
    () => ({
      name: "Bạn",
      gender: "—",
      dob: "—",
      email: "—"
    }),
    []
  );

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await api.get("/posts");
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("GET /posts error:", err);
      setPosts([]);
    }
  };

  const createPost = async () => {
    const t = title.trim();
    if (!t) return alert("Nhập tiêu đề trước");

    try {
      await api.post("/posts", { title: t, description: "Demo content" });
      setTitle("");
      await loadPosts();
    } catch (err) {
      console.error("POST /posts error:", err);
      alert("Không đăng được bài. Xem console/terminal backend.");
    }
  };

  return (
    <div className="vm-page">
      {/* TOP BRAND BAR */}
      <header className="vm-topbar">
        <div className="vm-brand">
          <span className="vm-dot" />
          <span className="vm-title">vibematch</span>
        </div>
        <div className="vm-subtitle">Kết nối sở thích • Nhóm hoạt động • Gặp đúng vibe</div>
      </header>

      <div className="vm-shell">
        {/* LEFT SIDEBAR */}
        <aside className="vm-sidebar">
          <div className="vm-avatarWrap">
            <div className="vm-avatar" />
          </div>

          <div className="vm-sideTitle">Hồ sơ cá nhân</div>

          <div className="vm-fields">
            <div className="vm-field"><span>Họ và tên:</span> <b>{profile.name}</b></div>
            <div className="vm-field"><span>Giới tính:</span> <b>{profile.gender}</b></div>
            <div className="vm-field"><span>Ngày sinh:</span> <b>{profile.dob}</b></div>
            <div className="vm-field"><span>Email:</span> <b>{profile.email}</b></div>
          </div>

          <button className="btn btn-outline-light btn-sm vm-logout" type="button">
            LOG OUT
          </button>
        </aside>

        {/* MAIN */}
        <main className="vm-main">
          {/* TABS */}
          <div className="vm-tabs">
            <button
              className={`vm-tab ${tab === "edit" ? "active" : ""}`}
              onClick={() => setTab("edit")}
              type="button"
            >
              Chỉnh sửa
            </button>
            <button
              className={`vm-tab ${tab === "reputation" ? "active" : ""}`}
              onClick={() => setTab("reputation")}
              type="button"
            >
              Uy tín
            </button>
            <button
              className={`vm-tab ${tab === "posts" ? "active" : ""}`}
              onClick={() => setTab("posts")}
              type="button"
            >
              Đăng bài
            </button>
          </div>

          {/* SCORE BAR */}
          <div className="vm-scoreBar">
            <div className="vm-scoreItem">★ Uy tín <b>100</b></div>
            <div className="vm-scoreItem">★ F-er <b>100</b></div>
            <div className="vm-scoreItem">★ F-ing <b>100</b></div>
            <div className="vm-scoreItem">★ Group <b>100</b></div>
          </div>

          {/* CONTENT */}
          <div className="vm-content">
            {tab === "posts" && (
              <>
                {/* CREATE POST */}
                <div className="vm-card vm-createCard">
                  <div className="vm-cardTitle">Tạo bài đăng</div>
                  <div className="d-flex gap-2">
                    <input
                      className="form-control"
                      placeholder="Nhập tiêu đề..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <button className="btn vm-btn" onClick={createPost} type="button">
                      Đăng
                    </button>
                  </div>
                  <div className="vm-hint">
                    API đang gọi: <code>{API_BASE}/posts</code>
                  </div>
                </div>

                {/* POSTS LIST */}
                <div className="vm-postList">
                  {posts.length === 0 && (
                    <div className="vm-empty">
                      Chưa có bài đăng nào. Thử nhập tiêu đề và bấm <b>Đăng</b>.
                    </div>
                  )}

                  {posts.map((p) => (
                    <div key={p.activity_id} className="vm-card vm-postCard">
                      <div className="vm-postRow">
                        <div className="vm-thumb">
                          <div className="vm-thumbIcon" />
                        </div>

                        <div className="vm-postMid">
                          <div className="vm-postTitle">{p.title}</div>
                          <div className="vm-postMeta">
                            {p.created_at ? new Date(p.created_at).toLocaleString() : ""}
                          </div>
                        </div>

                        <div className="vm-actions">
                          <button className="vm-actionBtn" type="button" title="Like">👍</button>
                          <button className="vm-actionBtn" type="button" title="Comment">💬</button>
                          <button className="vm-actionBtn" type="button" title="Save">🔖</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === "edit" && (
              <div className="vm-card">
                <div className="vm-cardTitle">Chỉnh sửa</div>
                <div className="vm-empty">
                  (Placeholder) Màn này lát nối API Users + UserInterests.
                </div>
              </div>
            )}

            {tab === "reputation" && (
              <div className="vm-card">
                <div className="vm-cardTitle">Uy tín</div>
                <div className="vm-empty">
                  (Placeholder) Màn này lát nối API ReputationLogs.
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}