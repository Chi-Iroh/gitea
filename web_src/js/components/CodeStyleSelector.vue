<script lang="ts">
import {defineComponent} from 'vue';
import {SvgIcon} from '../svg.ts';
import {showErrorToast} from '../modules/toast.ts';
import {GET} from '../modules/fetch.ts';
import {pathEscapeSegments} from '../utils/url.ts';

type Style = {
  name: string,
  selected: boolean
};

export default defineComponent({
  components: {SvgIcon},
  props: {
    elRoot: HTMLElement,
  },
  data() {
    return {
      csrfToken: window.config.csrfToken,
      allItems: [] as Style[],
      menuVisible: false,
      activeItemIndex: 0,

      currentRepoLink: this.elRoot.getAttribute('data-current-repo-link'),
      currentCommit: this.elRoot.getAttribute('data-current-commit'),
      currentFilepath: this.elRoot.getAttribute('data-current-filepath')
    };
  },
  watch: {
    menuVisible(visible: boolean) {
      if (!visible) return;
      this.loadTabItems();
    },
  },
  beforeMount() {
    document.body.addEventListener('click', (e) => {
      if (this.$el.contains(e.target)) return;
      if (this.menuVisible) this.menuVisible = false;
    });
  },

  mounted() {
    console.log(1);
    const item: Style = { name: '', selected: true };
    this.selectItem(item);
  },

  methods: {
    selectItem(item: Style) {
      this.menuVisible = false;
      console.log(item);
      // let link = this.refLinkTemplate;
      // link = link.replace('{RepoLink}', this.currentRepoLink);
      // link = link.replace('{RefType}', pathEscapeSegments(item.refType));
      // link = link.replace('{RefShortName}', pathEscapeSegments(item.refShortName));
      // link = link.replace('{TreePath}', pathEscapeSegments(this.currentTreePath));
      // window.location.href = link;
    },
    getSelectedIndexInFiltered() {
      for (let i = 0; i < this.allItems.length; ++i) {
        if (this.allItems[i].selected) return i;
      }
      return -1;
    },
    getActiveItem() {
      const el = this.$refs[`listItem${this.activeItemIndex}`];
      // @ts-expect-error - el is unknown type
      return (el && el.length) ? el[0] : null;
    },
    keydown(e: KeyboardEvent) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();

        if (this.activeItemIndex === -1) {
          this.activeItemIndex = this.getSelectedIndexInFiltered();
        }
        const nextIndex = e.key === 'ArrowDown' ? this.activeItemIndex + 1 : this.activeItemIndex - 1;
        if (nextIndex < 0) {
          return;
        }
        if (nextIndex > this.allItems.length) {
          return;
        }
        this.activeItemIndex = nextIndex;
        this.getActiveItem().scrollIntoView({block: 'nearest'});
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.getActiveItem()?.click();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.menuVisible = false;
      }
    },
    async loadTabItems() {
      try {
        // const url = '';
        // const resp = await GET(url);
        console.log(this.currentRepoLink, this.currentFilepath, this.currentCommit);
      } catch (e) {
        showErrorToast(`Network error when fetching styles, error: ${e}`);
        console.error(e);
      }
    },
  },
});
</script>
<template>
  <div class="ui dropdown custom ellipsis-text-items">
    <div tabindex="0" class="ui compact button" @click="menuVisible = !menuVisible">
        <span class="flex-text-block">
          <template v-for="style in allItems">
            <p>{{style.name}}</p>
          </template>
        </span>
    </div>
  </div>
</template>
