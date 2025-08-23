<script setup>
import { defineProps, ref, onMounted } from "vue";

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
});

const repoInfo = ref(null);
const openIssues = ref([]);
const closedIssues = ref([]);
const prInfo = ref(null);

const parseRepo = (url) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (match) {
    return { owner: match[1], repo: match[2] };
  }
  return null;
};

const parsePrNumber = (url) => {
  const match = url.match(/\/pull\/(\d+)/);
  return match ? match[1] : null;
};

onMounted(async () => {
  const parsed = parseRepo(props.url);
  if (!parsed) return;
  const { owner, repo } = parsed;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    const data = await res.json();

    repoInfo.value = {
      name: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      avatar: data.owner.avatar_url,
      issues: data.open_issues_count,
      html_url: data.html_url,
    };

    if (props.type === "iss") {
      const openRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=5`,
      );
      openIssues.value = await openRes.json();

      const closedRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?state=closed&per_page=5`,
      );
      closedIssues.value = await closedRes.json();
    }

    if (props.type === "pr") {
      const prNumber = parsePrNumber(props.url);
      if (prNumber) {
        const prRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
        );
        const prData = await prRes.json();

        prInfo.value = {
          title: prData.title,
          number: prData.number,
          state: prData.state, // "open" / "closed"
          merged: prData.merged_at !== null,
          url: prData.html_url,
        };
      }
    }
  } catch (e) {
    console.error("GitHub API error:", e);
  }
});
</script>
<template>
  <main>
    <a v-if="repoInfo" :href="repoInfo.html_url" target="_blank" class="lay">
      <div class="git-info">
        <div class="git-title-layout">
          <div class="git-title">
            <img width="20" :src="repoInfo.avatar" />
            <p>{{ repoInfo.name }}</p>
          </div>
        </div>
        <div class="git-state">
          <div class="git-desc">
            <span>{{ repoInfo.description }}</span>
          </div>
          <div class="git-num">
            <a
              v-if="repoInfo.stars > 0"
              role="listitem"
              target="_blank"
              :href="repoInfo.html_url + '/stargazers'"
            >
              <svg
                aria-hidden="true"
                height="16"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                data-view-component="true"
                fill="currentColor"
              >
                <path
                  d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"
                ></path>
              </svg>
              <div>
                <span>{{ repoInfo.stars }}</span> Stars
              </div>
            </a>
            <a
              v-if="repoInfo.forks > 0"
              role="listitem"
              target="_blank"
              :href="repoInfo.html_url + '/forks'"
            >
              <svg
                aria-hidden="true"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                version="1.1"
                width="16"
                data-view-component="true"
              >
                <path
                  d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"
                ></path>
              </svg>
              <div>
                <span>{{ repoInfo.forks }}</span>
                Fork
              </div>
            </a>
            <a
              v-if="repoInfo.tags > 0"
              target="_blank"
              role="listitem"
              :href="repoInfo.html_url + '/tags'"
            >
              <svg
                fill="currentColor"
                aria-hidden="true"
                height="16"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                data-view-component="true"
              >
                <path
                  d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
                ></path>
              </svg>
              <div>
                <span>{{ repoInfo.tags }}</span>
                <span> Tags</span>
              </div>
            </a>
            <a
              v-if="repoInfo.issues > 0"
              role="listitem"
              target="_blank"
              :href="repoInfo.html_url + '/issues'"
            >
              <svg
                aria-hidden="true"
                height="16"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                data-view-component="true"
                fill="currentColor"
              >
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                <path
                  d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"
                ></path>
              </svg>
              <div>
                <span>{{ repoInfo.issues }}</span>
                Issues
              </div>
            </a>
          </div>
          <div class="git-issues" v-if="props.type === 'iss'">
            <a
              v-for="issue in openIssues"
              role="listitem"
              :key="issue.id"
              target="_blank"
              :href="issue.html_url"
            >
              <svg
                aria-hidden="true"
                height="16"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                data-view-component="true"
                fill="currentColor"
              >
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                <path
                  d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"
                ></path>
              </svg>
              <div>
                <span>{{ issue.title }}</span>
                #{{ issue.number }}
              </div>
            </a>

            <a
              v-for="issue in closedIssues"
              role="listitem"
              :key="issue.id"
              target="_blank"
              class="close"
              :href="issue.html_url"
            >
              <svg
                aria-hidden="true"
                height="16"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                data-view-component="true"
                fill="currentColor"
              >
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                <path
                  d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"
                ></path>
              </svg>
              <div>
                <span>{{ issue.title }}</span>
                #{{ issue.number }}
              </div>
            </a>
          </div>
          <div class="git-pr" v-if="props.type === 'pr' && prInfo">
            <a
              role="listitem"
              target="_blank"
              :class="
                prInfo.merged
                  ? 'Merged'
                  : prInfo.state === 'open'
                    ? 'Open'
                    : 'Close'
              "
              :href="prInfo.url"
            >
              <svg
                height="16"
                viewBox="0 0 16 16"
                version="1.1"
                width="16"
                aria-hidden="true"
                fill="currentColor"
              >
                <path
                  d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"
                ></path>
              </svg>
              <span style="text-transform: uppercase">
                {{ prInfo.merged ? "Merged" : prInfo.state }} -
              </span>
              <span>{{ prInfo.title }} #{{ prInfo.number }}</span>
            </a>
          </div>
        </div>
      </div>
    </a>
  </main>
</template>

<style lang="scss" scoped>
.dark-mode .git-info {
  border: 1px solid #505050;
}
.dark-mode .git-info .git-title {
  border-bottom: 1px solid #505050;
}

.dark-mode .git-info .git-state .git-issues {
  border-top: 1px solid #505050;
}

.dark-mode .git-info .git-state .git-pr {
  border-top: 1px solid #505050;
}

main {
  margin-top: 20px !important;
  margin-bottom: 12px !important;
}
.lay {
  text-transform: none;
  text-decoration: none;
  color: #868686;
}
.git-info {
  &:hover {
    border-left: 5px solid #38e7cd;
  }
  border: 1px solid #e1e1e1;
  transition: border-left 0.3s ease;
  .git-title {
    img {
      border-radius: 100%;
    }
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid #e1e1e1;
    gap: 9px;
    p {
      margin: 0px;
    }
  }
  .git-state {
    padding: 12px;
    .git-num {
      gap: 12px;
      display: flex;
      margin-top: 12px;
      align-items: center;
      a {
        text-decoration: none;
        display: flex;
        gap: 3px;
        align-items: center;
        color: #868686;
      }
    }
    .git-issues {
      border-top: 1px solid #e1e1e1;
      padding-top: 12px;
      gap: 12px;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      margin-top: 12px;
      .close {
        svg {
          color: #8957e5;
        }
      }
      a {
        text-decoration: none;
        display: flex;
        gap: 3px;
        align-items: center;
        svg {
          color: #1f883d;
        }
        color: #868686;
      }
    }
    .git-pr {
      border-top: 1px solid #e1e1e1;
      padding-top: 12px;
      gap: 12px;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      margin-top: 12px;

      .Open svg {
        color: #1f883d;
      }
      .Close svg {
        color: #cf222e;
      }
      .Merged svg {
        color: #8250df;
      }

      a {
        text-decoration: none;
        display: flex;
        gap: 3px;
        align-items: center;

        color: #868686;
      }
    }
  }
}
</style>
