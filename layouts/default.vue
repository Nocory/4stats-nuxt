<template>
  <div class="default-template">
    <ComponentNav/>
    <nuxt/>
    <ComponentFooter/>
  </div>
</template>

<script>
export default {
	components: {
		ComponentNav: require("~/components/nav.vue").default,
		ComponentFooter: require("~/components/footer.vue").default,
	}
}
</script>

<style scoped lang="scss">
  @import "~assets/css/variables.scss";
  .default-template{
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 0;
    position: relative;
    min-height: 100vh;
    font-family: monospace;
    @include mobile{
      touch-action: pan-y;
    }
  }
</style>