## Emilly

> My own data-binding implementation engine. see [emilly alive](https://codepen.io/Halfeld/pen/GGaodL)

### How to use

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="main.css">
  <title>Emilly <3</title>
</head>
<body>

  <div class="editor">
    <textarea ly-model="markdown" ly-event="input, parseMarkdown"></textarea>
    <div ly-bind="markdownParsed"></div>
  </div>

  <script src="https://unpkg.com/marked@0.3.6"></script>
  <script src="../dist/emilly.umd.js"></script>
  <script>

    const emilly = new Emilly({
      observe: () => ({
        markdownParsed: '',
        markdown: ''
      }),
      methods: {
        parseMarkdown () {
          this.markdownParsed = marked(this.markdown)
        }
      }
    })
  </script>
</body>
</html>
```