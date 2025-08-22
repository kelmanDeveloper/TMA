<template>
  <button class="copy">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4.20166 7.63696C4.20166 5.86946 4.20166 4.98509 4.75104 4.43634C5.29979 3.88696 6.18416 3.88696 7.95166 3.88696L9.82666 3.88696C11.5942 3.88696 12.4785 3.88696 13.0273 4.43634C13.5767 4.98509 13.5767 5.86946 13.5767 7.63696L13.5767 10.762C13.5767 12.5295 13.5767 13.4138 13.0273 13.9626C12.4785 14.512 11.5942 14.512 9.82666 14.512L7.95166 14.512C6.18416 14.512 5.29979 14.512 4.75104 13.9626C4.20166 13.4138 4.20166 12.5295 4.20166 10.762L4.20166 7.63696Z"
        stroke="white"
        stroke-width="0.9375"
      />
      <path
        d="M4.20166 12.637C3.70438 12.637 3.22747 12.4394 2.87584 12.0878C2.5242 11.7362 2.32666 11.2592 2.32666 10.762L2.32666 7.01196C2.32666 4.65509 2.32666 3.47634 3.05916 2.74446C3.79104 2.01196 4.96979 2.01196 7.32666 2.01196L9.82666 2.01196C10.3239 2.01196 10.8009 2.20951 11.1525 2.56114C11.5041 2.91277 11.7017 3.38968 11.7017 3.88696"
        stroke="white"
        stroke-width="0.9375"
      />
    </svg>
  </button>
</template>


<style scoped>
.copy {
  width: 50px;
  height: 50px;
  transition: background 0.5s;
  font-size: var(--size-14);
  color: var(--color-white);
  line-height: var(--height-18);
  text-transform: uppercase;
  position: relative;
  border-radius: 10px;
  border: 1px solid #816bfa;
  background: #1e1d21;
  svg {
    position: absolute;
    top: 17px;
    left: 17px;
  }

  &:active {
    background-color: #b7b7b7;
    background-size: 100%;
    transition: background 0s;
  }
}
</style>