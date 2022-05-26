import promise_mtd from 'promise_mtd';

/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLForm}  the html form
 * @param  {HTMLForm}  the html form
 * @return {Object}   form data as an object literal
 */
export default class FormToJSON {
  constructor($form) {
    this.$elements = $form.elements;
    this.elements = Array.prototype.slice.call(this.$elements);
  }

  parse() {
    const res = {};
    this.elements.forEach(element => {
      // Make sure the element has the required properties and should be added.
      if (this.isValidElement(element) && this.isValidValue(element) && !this.isFile(element)) {

        /*
        * Some fields allow for more than one value, so we need to check if this
        * is one of those fields and, if so, store the values as an array.
        */
        if (this.isCheckbox(element)) {
          const name = element.name;
          const hasMany = this._has_many_checkbox_for(name);
          if (!res[name] && hasMany) {
            res[name] = [];
          }
          if (hasMany) {
            res[name].push(element.value);
          } else {
            res[name] = element.value;
          }
          // res[element.name] = (res[element.name] || []).concat(element.value);
        } else if (this.isMultiSelect(element)) {
          res[element.name] = this.getSelectValues(element);
        } else {
          res[element.name] = element.value;
        }
      }
    });
    return res;
  }

  /**
   * parse fields of form with input[type=file] as base64
   * @returns Promise<{Object}> fields with files (as base64)
   */
  parseWithFiles() {
    const res = this.parse();
    const inputs = this.elements.filter(el => this.isValidElement(el) && this.isFile(el));
    const storeForFiles = this._createStoreForFiles();
    return promise_mtd.forEach(inputs, function (input) {
      const name = input.name;
      if (input.multiple) {
        return promise_mtd.forEach(input.files, file => {
          return storeForFiles.add({ name, file });
        });
      } else {
        return storeForFiles.add({ name, file: input.files[0] });
      }
    }).then(() => storeForFiles.mergeTo(res));
  }

  _createStoreForFiles() {
    const hash = {};
    return {
      /**
       * add file to store
       * @param {{ name: string, file: File }}
       * @returns
       */
      add({ name, file }) {
        return convertToBase64(file).then(base64 => {
          if (hash[name] && !(hash[name] instanceof Array)) {
            hash[name] = [hash[name], base64];
          } else if (hash[name]) {
            hash[name].push(base64);
          } else {
            hash[name] = base64;
          }
        });
      },
      mergeTo(to) {
        const hashFiles = this.get();
        Object.keys(hashFiles).forEach(k => to[k] = hashFiles[k]);
        return to;
      },
      get() {
        return hash;
      },
    };
  }

  _has_many_checkbox_for(name) {
    let hasMany = 0;
    for (let i = 0, l = this.elements.length; i < l; i++) {
      const el = this.elements[i];
      if (el.type === 'checkbox' && el.name === name) {
        hasMany++;
        break;
      }
    }
    return hasMany > 1;
  }

  /**
   * Checks that an element has a non-empty `name` and `value` property.
   * @param  {Element} element  the element to check
   * @return {Bool}             true if the element is an input, false if not
   */
  isValidElement(element) {
    return element.name && element.value;
  }

  /**
   * Checks if an element’s value can be saved (e.g. not an unselected checkbox).
   * @param  {Element} element  the element to check
   * @return {Boolean}          true if the value should be added, false if not
   */
  isValidValue(element) {
    return (!['checkbox', 'radio'].includes(element.type) || element.checked);
  }

  /**
   * Checks if an input is a checkbox, because checkboxes allow multiple values.
   * @param  {Element} element  the element to check
   * @return {Boolean}          true if the element is a checkbox, false if not
   */
  isCheckbox(element){ return element.type === 'checkbox'; }

  /**
   * Checks if an input is a `select` with the `multiple` attribute.
   * @param  {Element} element  the element to check
   * @return {Boolean}          true if the element is a multiselect, false if not
   */
  isMultiSelect(element) { return element.options && element.multiple; }

  isFile(element) { return element.type === 'file'; }

  /**
   * Retrieves the selected options from a multi-select as an array.
   * @param  {HTMLOptionsCollection} options  the options for the select
   * @return {Array}                          an array of selected option values
   */
  getSelectValues(options) {
    return [].reduce.call(options, (values, option) => {
      return option.selected ? values.concat(option.value) : values;
    }, []);
  }

}


function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(reader.result);
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
}