This is a proof of concept for an embeddable S1Seven public verficiation page.

To use it just compile the output by running `npm run compile` or `npx tsc`.

This will add an `s1seven-verification.js` file to the root directory. Add that file to your project and add the following to your html file:

```html
<s1seven-verify></s1seven-verify>
<script type="module" src="./s1seven-verification.js">script>
```

Update the `src` path to point the the `s1seven-verification.js` file.
