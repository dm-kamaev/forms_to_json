A lightweight module (without Jquery) for serializing html forms into a JSON object.
In addition, it supports serialization of input fields with files in base64.

## Example with Html from

[Example serialize HTML form](https://codepen.io/dm-kamaev/pen/MWEwJRg?editors=1011).

<details>
<summary>Html Form</summary>
<form action="#">
  <div>
    <label>Author:</label>
    <input type="text" name=author>
  </div>
  <div>
    <label for="">Year:</label>
    <input type="number" name=year>
  </div>

  <div>
    <label class="checkbox">
      <input type="checkbox" name=isGoldCollection value=yes class=checkbox>
      Gold collection
    </label>
  </div>


  <div>
    <label class="radio">
      <input type="radio" value="v1" name="type">
      Variant 1
    </label>
  </div>


  <div>
    <label class="radio">
      <input type="radio" value="v2" name="type">
      Variant 2
    </label>
  </div>

  <div style=margin-top:16px>
    <select name="hero" class=select multiple>
      <option>Select hero</option>
      <option value="spider-man">Spider-Man</option>
      <option value="batman">Batman</option>
      <option value="superman">Superman</option>
      <option value="ironman">IronMan</option>
    </select>
  </div>

  <button type="submit">Create</button>
</form>
</details>
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


```js
import FormToJSON from 'form_to_json';

const $form = document.querySelector('form');

new FormToJSON($form).parseWithFiles().then((json) => {
  console.log(json);
}).catch(err => {
  console.log(err);
});
```