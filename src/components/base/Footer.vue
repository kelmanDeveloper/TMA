<script setup>
import HouseIcon from "@/components/icons/footer/HouseIcon.vue";
import TaskIcon from "@/components/icons/footer/TaskIcon.vue";
import DeviceIcon from "@/components/icons/footer/DeviceIcon.vue";
import FriendsIcon from "@/components/icons/footer/FriendsIcon.vue";
import { useLanguageStore } from "@/stores/languageStore";

const languageStore = useLanguageStore();
</script>

<template>
  <div class="footer-wrapper">
    <footer class="footer">
      <nav class="footer_navigation">
        <ul class="footer_navigation-list">
          <li class="footer_navigation-list_item">
            <RouterLink to="/main">
              <HouseIcon />
              {{ languageStore.t("baseComponents.footer.main") }}
            </RouterLink>
          </li>
          <li class="footer_navigation-list_item">
            <RouterLink to="/rating">
              <TaskIcon />
              {{ languageStore.t("baseComponents.footer.tasks") }}
            </RouterLink>
          </li>
          <li class="footer_navigation-list_item">
            <RouterLink to="/devices">
              <DeviceIcon />
              {{ languageStore.t("baseComponents.footer.devices") }}
            </RouterLink>
          </li>
          <li class="footer_navigation-list_item">
            <RouterLink to="/invite">
              <FriendsIcon />
              {{ languageStore.t("baseComponents.footer.friends") }}
            </RouterLink>
          </li>
          <li class="footer_navigation-list_item">
            <RouterLink to="/wallet">
              <svg
                width="25"
                height="25"
                viewBox="0 0 19 18"
                fill="none"
              >
                <rect
                  x="0.129883"
                  width="18"
                  height="18"
                  fill="url(#pattern0_3293_19199)"
                />
                <defs>
                  <pattern
                    id="pattern0_3293_19199"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlink:href="#image0_3293_19199"
                      transform="scale(0.01)"
                    />
                  </pattern>
                  <image
                    id="image0_3293_19199"
                    width="100"
                    height="100"
                    preserveAspectRatio="none"
                    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEuElEQVR4nO2dXahVRRTHd/ahliJUhiHpk5D1EBG+hPlSoKQWBFEYlaT1UBAEgoEI0YeEEBW9FPdmQvWQRZREPYR9UfhBDxr2QXGNEkpvfqTV9SPzF8Nd1XY6Z5+z713n7LX3rB+ctzNr1pn/npk1s+fMyjLHcRzHcRzHUQU4C5gLrAAGgU+A74BDwPfAW8Ct4Xu6NTv/AswA7gReBvbRHe8B5/9nxRkzwCTgBmA9sBM4zdgYGLsXiQNcCTwkT/Yf6PAXMKfq31YLgIuA24AXgb0lG/oI8C6wFlgIXA5cDFwN7Iq+u6bq32oS4FxgAfA4sEOe3m45BWwDHgXmA+cU1HNPVPbN/v5SwwBzgAeAt4GjJXvBD2EOkIjpwhJ1hl6S56ssVYBpwC3A88CekgL8DrwDPBiGoHEOhXkOZKkAnA1cA6wG3gdOlBThS+BJiagmKvk0OapjJGsywGzgXuB1WYyV4SdgI7AMuKSHC8c8p7MmERZX8gSHJ/nzUs0Px6TnrJae1JfVc+xE1pA1wT/D0PGSIgwBL8hkPLUi/+stCDABWAy8CgyXFGC/lLsbuDQzQG0FCeO49IQyEdGfMnQ9IsPQhMwYtRNENuueKxEVfQ08K73ogsw41EUQYIpMzp32ig4Cm4CVwKysZlAHQYB5wLcdIqKXgGvD+qJqfxsNcD9wsmCLYlVY4VbtZxIAd7V5n/CLTOiTqvYxGYAbZac0ZqCqNULqG30/R0KERd59soG3Wd5DjJAev0nkuFkCl+n9ECS8vInZLZO3cyahTZ7q6TwqWxhOOQ4A1/dCjKtKOuKcuROxXFuQEMYWsVeGtCDctCzN+XWeLJIPtRFlkWaF4QBZO8JO7BS1ymqOvGEM571ifg1bTFqVfNxGjMdUKmggtA6CNmgZ/6aFcT990QEZPfKEkzGzs/EC/BgZHrHyrsIyYbHc4ozYKg3DYVskjx+p7BLg4ajttmgYPRwZXThuo4kAXBG13ZCG0fh9h060kM5B7zzHNYzGmH/LZ4m48dQNAuepeJoI9EEQcwcRkhZExcuEwAWxhQtiDBfEGC6IMVwQY7ggxnBBjOGCGMMFMYYLYgwXxBguiDFckB4B3Ax8JJcShM+HwNIuyvlurzZyCK4dT3Qo64L0oGd0YklBeRdEExmmOvFBQXkXRBP5/0cnjhaUd0EqEORIQXkXRBOJpjrR9gCcC6IMcFMXgiwuKO89RBtgXYEYhf8CcEF6RAhtQzQlc0r4bCnqGbly3kMs4YIYwwUxhgtiDBfEGC6IMVwQY7ggxnBBjOGCGMMFMYYLYgwXxBguiDFcEGO4IAkIEt/T61kvq0wII5c55uk6qVbqANOjthvWMPpFZHS+ircJwGhqvzy7NIxuiIw+reJtAjCaliPPYC+OwYTrmmaqeNxggFktbvpeomF4oqSyzvOpVmq6Bt+TtTVqsyG1m5SAO/g/nwGXqVTQvJ6xtUV73a4dvr3RopIwfD0DXBcS+maJwmgy4wUyZ7RKSPCa+nIh3CQniYCdcmwP+RtVxYjGxldKOpQym3p+JaIMX8vGkDA4JfaEOaOvuxohYpDzroOyeCybRLJJDEsbDEib+L2UjuM4juM4juNkdeFvsjzhqvkGS8gAAAAASUVORK5CYII="
                  />
                </defs>
              </svg>

              {{ languageStore.t("baseComponents.footer.wallet") }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
div {
  position: fixed;
  width: 100%;
  padding: 0 2rem 1.6rem 2rem;
  bottom: 0;
  z-index: 3;
  .footer {
    padding: 1rem 1.6rem;
    background: #2b2b36;
    border-radius: 8px;
    position: relative;
    /* box-shadow: 0px -2px 5px 0px #6da1dc, 0px 2px 5px 2px #816cf6; */
    border: 1px #816bfa solid;
    /* box-shadow: 0px 2px 5px #8f31bc; */

    .footer_navigation-list {
      display: flex;
      justify-content: space-between;

      .footer_navigation-list_item {
        flex: 1 1;
        a {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: var(--font-10);
          line-height: var(--height-16);
          border-radius: 4px;
          padding: 0.8rem;
          font-weight: bold;
          color: #fff;
        }
        .router-link-active.router-link-exact-active {
          color: #fff;
          border: 1px #8157d4 solid;
          background: rgba(96, 60, 148, 0.36);
        }
      }
    }
  }
}
</style>