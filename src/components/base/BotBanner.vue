<script setup>
import { useLanguageStore } from "@/stores/languageStore";

const languageStore = useLanguageStore();
const emit = defineEmits(['showDownloadAlert']);

function showDownloadAlert() {
  emit('showDownloadAlert');
}
</script>

<template>
  <section class="bot_banner">
    <div class="bot_banner-wrapper" @click="showDownloadAlert">
      <div>
        <p>{{languageStore.t('baseComponents.connectionInstructions') }}</p>
        <div class="link-icon">
          <svg width="50" height="50" viewBox="0 0 41 41" fill="none">
            <rect
              x="4.5"
              y="4.5"
              width="39"
              height="39"
              fill="url(#pattern0_2830_18288)"
            />
            <defs>
              <pattern
                id="pattern0_2830_18288"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlink:href="#image0_2830_18288"
                  transform="scale(0.0084)"
                />
              </pattern>

              <image
                id="image0_2830_18288"
                width="100"
                height="100"
                preserveAspectRatio="none"
                xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC7UlEQVR4nO3du2oUUQDG8QN2AUXJ1cYbgth4eQIDphUxXkCxsPIJFO/aGLSLPoDYaaMPkNeILmphrI22dkv+cvAUy5KZzJq5fGf3+8FAIJnb/pmZnZ3ZSQhmZmZmZmZmZmZmZma7B5wEbgK3axouAws1LNrkAV4DW9TvD3Cj6/XLCnCxgRDDUfLYUoBZ4DSwVNNwHjgy4jK8onmXgipgP/AM6DX4AqwBByouzwOadysoAq4Bv2nHm4rLtNDCMukFAe41dOAs8muEZTsOvAO+At8rDj/JNUjaMtqMEW00uD5zwGdyDJKOGW3tpgbdF4khFyQewNu0EWMAe0RiyAUpejfVB1ZGfZvalV3E0AmSzjOKPA+ZoFqM+PtN9SBnS1bgUMgnxqcdYnwBDgI/1IMsFq1BGK8tYy79vYMobBkD4ziISow0noOoxEjjOohKjDS+g6jESNNwEJUYaToOohIjTctBVGKk6TnI/wLmK570zY8wzW8F07keFKieqdNAjDTd99tMJ14HOhEUKAahoRgDVx6Hr/2sBhVqQWgwxtA1+ng9ZhW4EJQoBaHmA3iWVILgGDpBcAydIDiGThAcQycIjqEThH83VvSafGubrY6CfHQMkSDAVLrfazLPMzIL0mtiNxXvkAQepk9648cmb6t+FWJSdlkf2oqR5vdom/mtBUUdBZlOUfppiD/PNji/omsgh4Oajs9DpuLQwnyKnAtquj5Tb0NJkMWgxkHEOIgYBxHjIGIcRIyDiHEQMQ4ixkHEOIgYBxHjIGIcRIyDiHEQMQ4ixkHEAGdKrqhl8VimMsCxkvU7FdTs8HimlZA54EXJ+k0HRSXfWOqnFcpuSwGOAi9L7gFbD6qAp0yex0EVsHfER6rmbhPYF5QBVzt4TGwX4jouhxwAd8c8yhZwJ+QEuBKfOM147qaWQ47i/hV4UuEryjlYjwdw+WNGVcBMPIGq8d9VLLU0xGWe6fr1MzMzMzMzMzMzMzMzM7MwAf4CNOZXEaXI0KoAAAAASUVORK5CYII="
              />
              
            </defs>
          </svg>
        </div>
      </div>
      <svg
        width="310"
        height="335"
        viewBox="0 0 310 335"
        fill="none"
        class="gradient"
      >
        <g filter="url(#filter0_f_2851_18290)">
          <g
            clip-path="url(#paint0_diamond_2851_18290_clip_path)"
            data-figma-skip-parse="true"
          >
            <g
              transform="matrix(0.121535 -0.0701685 0.0180551 0.0312723 154.742 167.507)"
            >
              <rect
                x="0"
                y="0"
                width="966.192"
                height="1012.55"
                fill="url(#paint0_diamond_2851_18290)"
                opacity="1"
                shape-rendering="crispEdges"
              />
              <rect
                x="0"
                y="0"
                width="966.192"
                height="1012.55"
                transform="scale(1 -1)"
                fill="url(#paint0_diamond_2851_18290)"
                opacity="1"
                shape-rendering="crispEdges"
              />
              <rect
                x="0"
                y="0"
                width="966.192"
                height="1012.55"
                transform="scale(-1 1)"
                fill="url(#paint0_diamond_2851_18290)"
                opacity="1"
                shape-rendering="crispEdges"
              />
              <rect
                x="0"
                y="0"
                width="966.192"
                height="1012.55"
                transform="scale(-1)"
                fill="url(#paint0_diamond_2851_18290)"
                opacity="1"
                shape-rendering="crispEdges"
              />
            </g>
          </g>
          <ellipse
            cx="155.042"
            cy="167.334"
            rx="36.1102"
            ry="134.793"
            transform="rotate(60 155.042 167.334)"
            data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_DIAMOND&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.11764705926179886,&#34;g&#34;:0.10980392247438431,&#34;b&#34;:0.12941177189350128,&#34;a&#34;:1.0},&#34;position&#34;:0.082725211977958679},{&#34;color&#34;:{&#34;r&#34;:0.47843137383460999,&#34;g&#34;:0.20784313976764679,&#34;b&#34;:0.85882353782653809,&#34;a&#34;:1.0},&#34;position&#34;:0.33772519230842590},{&#34;color&#34;:{&#34;r&#34;:0.95190513134002686,&#34;g&#34;:0.91786074638366699,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:0.51772516965866089},{&#34;color&#34;:{&#34;r&#34;:0.47843137383460999,&#34;g&#34;:0.20784313976764679,&#34;b&#34;:0.85882353782653809,&#34;a&#34;:1.0},&#34;position&#34;:0.64272516965866089},{&#34;color&#34;:{&#34;r&#34;:0.11764705926179886,&#34;g&#34;:0.10980392247438431,&#34;b&#34;:0.12941177189350128,&#34;a&#34;:0.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.11764705926179886,&#34;g&#34;:0.10980392247438431,&#34;b&#34;:0.12941177189350128,&#34;a&#34;:1.0},&#34;position&#34;:0.082725211977958679},{&#34;color&#34;:{&#34;r&#34;:0.47843137383460999,&#34;g&#34;:0.20784313976764679,&#34;b&#34;:0.85882353782653809,&#34;a&#34;:1.0},&#34;position&#34;:0.33772519230842590},{&#34;color&#34;:{&#34;r&#34;:0.95190513134002686,&#34;g&#34;:0.91786074638366699,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:0.51772516965866089},{&#34;color&#34;:{&#34;r&#34;:0.47843137383460999,&#34;g&#34;:0.20784313976764679,&#34;b&#34;:0.85882353782653809,&#34;a&#34;:1.0},&#34;position&#34;:0.64272516965866089},{&#34;color&#34;:{&#34;r&#34;:0.11764705926179886,&#34;g&#34;:0.10980392247438431,&#34;b&#34;:0.12941177189350128,&#34;a&#34;:0.0},&#34;position&#34;:1.0}],&#34;transform&#34;:{&#34;m00&#34;:243.07096862792969,&#34;m01&#34;:36.110157012939453,&#34;m02&#34;:15.151177406311035,&#34;m10&#34;:-140.33708190917969,&#34;m11&#34;:62.544639587402344,&#34;m12&#34;:206.40342712402344},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}"
          />
        </g>
        <g
          style="mix-blend-mode: lighten"
          filter="url(#filter1_f_2851_18290)"
        >
          <ellipse
            cx="155.041"
            cy="167.334"
            rx="56.1061"
            ry="54.6898"
            transform="rotate(150 155.041 167.334)"
            fill="url(#paint1_radial_2851_18290)"
          />
        </g>
        <g
          style="mix-blend-mode: lighten"
          filter="url(#filter2_f_2851_18290)"
        >
          <g
            clip-path="url(#paint2_diamond_2851_18290_clip_path)"
            data-figma-skip-parse="true"
          >
            <g
              transform="matrix(0.0498412 0.0863274 -0.0315315 0.0182047 154.919 166.951)"
            >
              <rect
                x="0"
                y="0"
                width="967.509"
                height="1012.45"
                fill="url(#paint2_diamond_2851_18290)"
                opacity="1"
                shape-rendering="crispEdges"
              />
              <rect
                x="0"
                y="0"
                width="967.509"
                height="1012.45"
                transform="scale(1 -1)"
                fill="url(#paint2_diamond_2851_18290)"
                opacity="1"
                shape-rendering="crispEdges"
              />
              <rect
                x="0"
                y="0"
                width="967.509"
                height="1012.45"
                transform="scale(-1 1)"
                fill="url(#paint2_diamond_2851_18290)"
                opacity="1"
                shape-rendering="crispEdges"
              />
              <rect
                x="0"
                y="0"
                width="967.509"
                height="1012.45"
                transform="scale(-1)"
                fill="url(#paint2_diamond_2851_18290)"
                opacity="1"
                shape-rendering="crispEdges"
              />
            </g>
          </g>
          <ellipse
            cx="155.042"
            cy="167.164"
            rx="36.4094"
            ry="95.7442"
            transform="rotate(150 155.042 167.164)"
            data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_DIAMOND&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.11764705926179886,&#34;g&#34;:0.10980392247438431,&#34;b&#34;:0.12941177189350128,&#34;a&#34;:1.0},&#34;position&#34;:0.082725211977958679},{&#34;color&#34;:{&#34;r&#34;:0.47843137383460999,&#34;g&#34;:0.20784313976764679,&#34;b&#34;:0.85882353782653809,&#34;a&#34;:1.0},&#34;position&#34;:0.33772519230842590},{&#34;color&#34;:{&#34;r&#34;:0.95190513134002686,&#34;g&#34;:0.91786074638366699,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:0.51772516965866089},{&#34;color&#34;:{&#34;r&#34;:0.47843137383460999,&#34;g&#34;:0.20784313976764679,&#34;b&#34;:0.85882353782653809,&#34;a&#34;:1.0},&#34;position&#34;:0.64272516965866089},{&#34;color&#34;:{&#34;r&#34;:0.11764705926179886,&#34;g&#34;:0.10980392247438431,&#34;b&#34;:0.12941177189350128,&#34;a&#34;:0.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.11764705926179886,&#34;g&#34;:0.10980392247438431,&#34;b&#34;:0.12941177189350128,&#34;a&#34;:1.0},&#34;position&#34;:0.082725211977958679},{&#34;color&#34;:{&#34;r&#34;:0.47843137383460999,&#34;g&#34;:0.20784313976764679,&#34;b&#34;:0.85882353782653809,&#34;a&#34;:1.0},&#34;position&#34;:0.33772519230842590},{&#34;color&#34;:{&#34;r&#34;:0.95190513134002686,&#34;g&#34;:0.91786074638366699,&#34;b&#34;:1.0,&#34;a&#34;:1.0},&#34;position&#34;:0.51772516965866089},{&#34;color&#34;:{&#34;r&#34;:0.47843137383460999,&#34;g&#34;:0.20784313976764679,&#34;b&#34;:0.85882353782653809,&#34;a&#34;:1.0},&#34;position&#34;:0.64272516965866089},{&#34;color&#34;:{&#34;r&#34;:0.11764705926179886,&#34;g&#34;:0.10980392247438431,&#34;b&#34;:0.12941177189350128,&#34;a&#34;:0.0},&#34;position&#34;:1.0}],&#34;transform&#34;:{&#34;m00&#34;:99.682304382324219,&#34;m01&#34;:-63.062908172607422,&#34;m02&#34;:136.60948181152344,&#34;m10&#34;:172.65484619140625,&#34;m11&#34;:36.409378051757812,&#34;m12&#34;:62.418785095214844},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}"
          />
        </g>
        <defs>
          <filter
            id="filter0_f_2851_18290"
            x="31.903"
            y="88.0178"
            width="246.278"
            height="158.632"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="2.5"
              result="effect1_foregroundBlur_2851_18290"
            />
          </filter>
          <clipPath id="paint0_diamond_2851_18290_clip_path">
            <ellipse
              cx="155.042"
              cy="167.334"
              rx="36.1102"
              ry="134.793"
              transform="rotate(60 155.042 167.334)"
            />
          </clipPath>
          <filter
            id="filter1_f_2851_18290"
            x="94.2758"
            y="107.278"
            width="121.531"
            height="120.112"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="2.5"
              result="effect1_foregroundBlur_2851_18290"
            />
          </filter>
          <filter
            id="filter2_f_2851_18290"
            x="92.7125"
            y="77.2542"
            width="124.66"
            height="179.82"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="2.5"
              result="effect1_foregroundBlur_2851_18290"
            />
          </filter>
          <clipPath id="paint2_diamond_2851_18290_clip_path">
            <ellipse
              cx="155.042"
              cy="167.164"
              rx="36.4094"
              ry="95.7442"
              transform="rotate(150 155.042 167.164)"
            />
          </clipPath>
          <linearGradient
            id="paint0_diamond_2851_18290"
            x1="0"
            y1="0"
            x2="500"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.0827252" stop-color="#1E1C21" />
            <stop offset="0.337725" stop-color="#7A35DB" />
            <stop offset="0.517725" stop-color="#F3EAFF" />
            <stop offset="0.642725" stop-color="#7A35DB" />
            <stop offset="1" stop-color="#1E1C21" stop-opacity="0" />
          </linearGradient>
          <radialGradient
            id="paint1_radial_2851_18290"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(155.041 167.474) rotate(-90) scale(56.9393 56.1061)"
          >
            <stop offset="0.0827252" stop-color="#1E1C21" />
            <stop offset="0.337725" stop-color="#7A35DB" />
            <stop offset="0.517725" stop-color="#F3EAFF" />
            <stop offset="0.642725" stop-color="#7A35DB" />
            <stop offset="1" stop-color="#1E1C21" stop-opacity="0" />
          </radialGradient>
          <linearGradient
            id="paint2_diamond_2851_18290"
            x1="0"
            y1="0"
            x2="500"
            y2="500"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.0827252" stop-color="#1E1C21" />
            <stop offset="0.337725" stop-color="#7A35DB" />
            <stop offset="0.517725" stop-color="#F3EAFF" />
            <stop offset="0.642725" stop-color="#7A35DB" />
            <stop offset="1" stop-color="#1E1C21" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.bot_banner {
  margin-bottom: 16px;
}

.bot_banner-wrapper {
  position: relative;
  padding: 16px 26px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px #b5a4ff solid;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.bot_banner-wrapper:hover {
  transform: scale(1.02);
}

.bot_banner-wrapper > div {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.bot_banner-wrapper p {
  color: white;
  align-content: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 20.7px;
}

.link-icon {
  background: #2b2b36;
  display: grid;
  width: 50px;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  place-content: center;
}

.gradient {
  position: absolute;
  top: -120px;
  right: -118px;
  z-index: -1;
}

.bot_banner-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: inherit;
  background: linear-gradient(
    165deg,
    #7a35db 0%,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0) 10%
  );
  opacity: 0.8;
}
</style>