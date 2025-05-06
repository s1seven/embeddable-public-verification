This is a proof of concept for an embeddable S1Seven public verficiation page.

# Compiling and embedding the component:

To use it just bundle the output by running `npm run build` (you may need to first run `npm run install`).

This will add an `s1seven-verification.component.js` file to the `./dist` directory. Add that file to your project (usually to the `public` directory) and add the following to your html file:

```html
<s1seven-verify></s1seven-verify>
<script type="module" src="./s1seven-verification.component.js">script>
```

Update the `src` path to point the the `s1seven-verification.component.js` file if necessary.

# Localization

The component is fully localized and supports both English and German translations.
To use the localization, just add the `lang` attribute to the `s1seven-verify` component, for example:
```html		
<s1seven-verify lang="de"></s1seven-verify>
```

Supported values are `de` and `en`, with `en` being the default.

# Screenshot of verification component:

<img width="1800" alt="image" src="https://github.com/user-attachments/assets/d83fe506-6b1c-413f-81b3-45e4888200c3" />
