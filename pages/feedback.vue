<template>
  <div class="component-feedback has-text-centered">
    <form name="feedback" method="post" class="has-text-left" netlify autocomplete="off" netlify-honeypot="dont">
      <input type="hidden" name="form-name" value="feedback">
      <input type="text" name="dont" class="is-hidden">
      <textarea class="textarea" rows="10" name="message" required minlength="10" maxlength="1000" placeholder="type..."/>
      <div class="button-group">
        <nuxt-link to="/">
          <button class="button" type="button" @click="$emit('update:showFeedbackForm', false)">Cancel</button>
        </nuxt-link>
        <button class="button" type="submit">Send</button>
        <!--<button class="button" type="button" @click="send">Send</button>-->
      </div>
    </form>
  </div>
</template>

<script>
const axios = require("axios")
export default {
	methods:{
		send(){
			var params = new URLSearchParams()
			params.append('param1', 'value1')
			params.append('param2', 'value2')
			axios.post('/', params)
		}
	}
}
</script>

<style scoped lang="scss">
@import "~assets/css/variables.scss";
.component-feedback{
  z-index: 1001;
  position: fixed;
  top: 0;
  left:0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.9);
}

form{
  z-index: 2;
  width: 512px;
  max-width: 95%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button-group{
  width: 100%;
  display: flex;
  justify-content: space-around;
}

button{
  margin: 1rem 0 0;
  width: 128px;
}
</style>