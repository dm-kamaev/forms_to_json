A lightweight module (without Jquery) for serializing html forms into a JSON object.
In addition, it supports serialization of input fields with files in base64.

## Serialize Form

[Example serialize HTML form](https://codepen.io/dm-kamaev/pen/MWEwJRg?editors=1011).


```js
import FormToJSON from 'form_to_json';

const $form = document.querySelector('form');

const json = new FormToJSON($form).parse();
console.log(json);
/*
{
  "author": "12334",
  "year": "1900",
  "isGoldCollection": "yes",
  "type": "v2",
  "hero": [
    "spider-man",
    "batman"
  ]
}
*/
```

## Serialize Form with Files

Files converting to base64.

[Example serialize HTML form with files](https://codepen.io/dm-kamaev/pen/qBPdraX?editors=1111).

```js
import FormToJSON from 'form_to_json';

const $form = document.querySelector('form');

new FormToJSON($form).parseWithFiles().then((json) => {
  console.log(json);
  /*
  {
    "author": "War and Peace",
    "files": [
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABEwAAAJkCAYAAAALLrTbAA...."
      "data:image/png;base64,QLbZMHkY7t0kaPHi3z5s2T0qVLO2wr07p1a8mUKZO21mNf...."
    ]
  }
  */
}).catch(err => {
  console.log(err);
});
```