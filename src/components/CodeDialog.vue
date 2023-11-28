<template>
  <v-dialog scrollable v-model="dialog" @keydown.esc="cancel">
    <v-card>
      <v-toolbar dark dense flat>
        <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text style="height: 450px">
        <pre>
          {{ code }}
        </pre>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" flat="flat" @click.native="copy">Copy</v-btn>
        <v-btn color="primary darken-1" flat="flat" v-if="this.title == 'JSON Template'" @click.native="saveJSON">Save As JSON</v-btn>
        <v-btn color="primary darken-1" flat="flat" v-if="this.title == 'RAFI - Selenium Java Template'"  @click.native="saveJava">Save As Java</v-btn>
        <v-btn color="primary darken-1" flat="flat" @click.native="close">Ok</v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    code: null,
    title: null,
  }),
  methods: {
    show(title, code) {
      this.dialog = true;
      this.title = title;
      this.code = code;
    },
    close() {
      this.dialog = false;
    },
    copy() {
      const copyEl = document.createElement('pre');
      copyEl.setAttribute('style', 'height: 0px');
      copyEl.contentEditable = 'true';
      document.body.appendChild(copyEl);
      copyEl.appendChild(document.createTextNode(this.code));
      copyEl.unselectable = 'off';
      copyEl.focus();
      document.execCommand('SelectAll');
      document.execCommand('Copy', false, null);
      document.body.removeChild(copyEl);
      this.dialog = false;
      this.$root.$popupSuccess('The code has been copied to your clipboard');
    },
    saveJava() {
      const filename = prompt('Please enter your file name without extension');
      if (filename) {
        if (filename.match(/[^\w]|_/) == null) {
          const FileSaver = require('file-saver');
          const importSeleniumPackage_By = 'import org.openqa.selenium.By;';
          const newLine = '\r\n';
          const contentToWrite =  importSeleniumPackage_By + newLine + newLine + 'public class ' + filename + '{' + this.code + newLine + '}';

          var blob = new Blob([contentToWrite], { type: 'text/plain;charset=utf-8' });
          FileSaver.saveAs(blob, filename + ".java");
          document.body.removeChild(copyEl);
          this.dialog = false;
          this.$root.$popupSuccess('The code has been saved to your local storage');
          alert('File saved successfully...');
        } else {
          alert('Invalid File Name entered...!!!');
        }
      } else {
        delete window.alert;
        alert('File save canceled...');
      }
    },
    saveJSON() {
      const filename = prompt('Please enter your file name without extension');
      if (filename) {
        if (filename.match(/[^\w]|_/) == null) {
          const FileSaver = require('file-saver');
          const newLine = '\r\n';
          const contentToWrite =  '{' + newLine + '"elements": [' + this.code + newLine + '\r\t' + ']' + newLine + '}';

          var blob = new Blob([contentToWrite], { type: 'text/plain;charset=utf-8' });
          FileSaver.saveAs(blob, filename + ".json");
          document.body.removeChild(copyEl);
          this.dialog = false;
          this.$root.$popupSuccess('The code has been saved to your local storage');
          alert('File saved successfully...');
        } else {
          alert('Invalid File Name entered...!!!');
        }
      } else {
        delete window.alert;
        alert('File save canceled...');
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import '../styles/colours';
@import '../styles/buttons';
pre {
  font-size: 11px;
}
</style>
