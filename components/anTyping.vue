<template>
  <p><slot></slot><span>|</span></p>
</template>

<style lang="scss" scoped>
p {
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  animation: type 4s steps(60, end);
  margin: 0;
}

p:nth-child(2) {
  animation: type2 1s steps(60, end);
}

span {
  animation: blink 1s infinite;
}

@keyframes type {
  from {
    width: 0;
  }
}

@keyframes type2 {
  0% {
    width: 0;
  }

  50% {
    width: 0;
  }

  100% {
    width: 100;
  }
}

@keyframes blink {
  to {
    opacity: 0;
  }
}

::selection {
  background: black;
}
</style>
