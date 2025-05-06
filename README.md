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

# Screenshots of verification component:

<img width="1800" alt="Screenshot 2025-05-06 at 11 13 42" src="https://github.com/user-attachments/assets/e66939f7-0179-49b7-8f9e-56a67998134d" />
<img width="1800" alt="Screenshot 2025-05-06 at 11 13 51" src="https://github.com/user-attachments/assets/45a00a52-09c1-4ba8-ad51-493a49c4a2c4" />
<img width="1800" alt="Screenshot 2025-05-06 at 11 13 35" src="https://github.com/user-attachments/assets/4c0da89f-703b-4ae6-93ec-ff6419d00fa6" />
<img width="1800" alt="Screenshot 2025-05-06 at 11 13 16" src="https://github.com/user-attachments/assets/d3adeb4e-cb23-4bd0-a758-5df8a9349ab2" />
