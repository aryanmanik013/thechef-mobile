<template>
    <style-wrapper>
        <setup></setup>
    </style-wrapper>
</template>

<script>
  import Setup from '@/Setup'
  import StyleWrapper from '@/plugins/StyleWrapper'
  import * as Sentry from 'sentry-expo';
/*   Sentry.init({
    dsn: 'https://fb8b6cf92e5d40659e05bef598b3ee88@o398350.ingest.sentry.io/5253915',
    enableInExpoDevelopment: true,
    debug: true,
  }); */
  export default {
    components: {
      Setup, StyleWrapper
    }
  }
</script>