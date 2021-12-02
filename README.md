

```js
import FormToJSON from './form_to_json';

const $form = document.querySelector('form');

const json = new FormToJSON($form).parse();
console.log(json);
```


```js
import FormToJSON from './form_to_json';

const $form = document.querySelector('form');

new FormToJSON($form).parseWithFiles().then((json) => {
  console.log(json);
}).catch(err => {
  console.log(err);
});
```