import { html, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { TailwindElement } from "../shared/tailwind.element";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

type Summary = {
	sellerName: String;
	buyerName: String;
	productDescription: String;
	orderNumber: String;
	orderPosition: String;
	deliveryNumber: String;
	deliveryPosition: String;
	identifier: String;
};

export enum HashAlgorithm {
	Md5 = "md5",
	Sha1 = "sha1",
	Sha256 = "sha256",
	Sha512 = "sha512",
	Sha3256 = "sha3-256",
	Sha3384 = "sha3-384",
	Sha3512 = "sha3-512",
}

type Hash = {
	value: String;
	algorithm: HashAlgorithm;
};

type Identity = {
	id: String;
	publicKey: string;
};

type Company = {
	name: String;
};

interface VerificationData {
	summary: Summary;
	identity?: Identity;
	company?: Company;
	hash: Hash;
	timestamp: string;
}

const translations = {
	en: {
		"wasAttested": "The document with the {{ hashAlgorithm }} hash <b>{{ hash }}</b> was attested on {{ date }}.",
		"wasAttestedByCompany":
			"The document with the {{ hashAlgorithm }} hash <b>{{ hash }}</b> was attested by <b>{{ companyName }}</b> with the public key {{ publicKey }} on {{ date }}.",
		verifyCertificate: "Verify Certificate",
		uploadDescription: "Upload a certificate to check the integrity of the data and the authenticity of its originator.",
		chooseFile: "Choose certificate file",
		orDrag: "or drag it here",
		filesSupported: "Files supported: JSON",
		neverStored: "Uploaded certificates are never stored.",
		certificateNotarized: "Certificate was notarized",
		certificateNo: "Certificate no.",
		from: "From",
		for: "For",
		product: "Product",
		number: "Number",
		position: "Position",
		deliveryNumber: "Delivery number",
		deliveryPosition: "Delivery position",
		close: "Close",
		certificateNotValid: "Certificate is not valid",
		verifying: "Verifying...",
		removeFile: "Remove file",
		uploadError: "Upload Error",
		unknownDate: "Unknown date",
	},
	de: {
		"wasAttested": "Das Dokument <b>{{ fileName }}</b> mit dem {{ hashAlgorithm }} Hash <b>{{ hash }}</b> wurde am {{ date }} notarisiert.",
		"wasAttestedByCompany":
			"Das Dokument mit dem {{ hashAlgorithm }} Hash <b>{{ hash }}</b> wurde durch <b>{{ companyName }}</b> mit dem Public Key {{ publicKey }} am {{ date }} notarisiert.",
		verifyCertificate: "Verifiziere Zertifikat",
		uploadDescription: "Zertifikat hochladen um die Integrität und die Authentizität des Erstellers zu prüfen.",
		chooseFile: "Wähle Zertifikatsdatei",
		orDrag: "oder ziehe sie hierher",
		filesSupported: "Unterstützte Dateiformate: JSON",
		neverStored: "Hochgeladene Zertifikate werden nie gespeichert.",
		certificateNotarized: "Das Zertifikat ist gültig",
		certificateNo: "Zertifikats-Nr.",
		from: "Von",
		for: "Für",
		product: "Produkt",
		number: "Nummer",
		position: "Position",
		deliveryNumber: "Liefernummer",
		deliveryPosition: "Lieferposition",
		close: "Schließen",
		certificateNotValid: "Das Zertifikat ist nicht gültig",
		verifying: "Überprüfe...",
		removeFile: "Datei entfernen",
		uploadError: "Upload-Fehler",
		unknownDate: "Unbekanntes Datum",
	},
};

@customElement("s1seven-verify")
export class S1sevenVerify extends TailwindElement("") {
	@property({ type: String, reflect: true })
	lang = "en";

	@state() private _verificationData: VerificationData | null = null;
	@state() private _isValid: boolean | null = null;
	@state() private _showResults = false;
	@state() private _isFileOver = false;
	@state() private _selectedFile: File | null = null;
	@state() private _isValidating = false;
	@state() private _validationError: string | null = null;

	private t(key: keyof (typeof translations)["en"]) {
		const langKey = this.lang === "de" ? "de" : "en";
		return translations[langKey][key] || translations["en"][key];
	}

	private _handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = "copy";
			this._isFileOver = true;
		}
	}

	private _handleDragLeave() {
		this._isFileOver = false;
	}

	private _handleDrop(event: DragEvent) {
		event.preventDefault();
		this._isFileOver = false;
		const file = event.dataTransfer?.files[0];
		if (file && file.type === "application/json") {
			this._handleFileSelect(file);
		} else {
			this._validationError = "Invalid file type. Please upload a JSON file.";
			this._selectedFile = null;
		}
	}

	private _handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			this._handleFileSelect(file);
		}
		input.value = "";
	}

	private _handleFileSelect(file: File) {
		this._selectedFile = file;
		this._validationError = null;
		this._isValidating = true;
		this._verificationData = null;
		this._isValid = null;
		this._showResults = false;

		const reader = new FileReader();
		reader.onload = async () => {
			const fileContent = reader.result;
			try {
				const response = await fetch("https://app.s1seven.com/api/certificates/verify?mode=live", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: fileContent,
				});

				const data = await response.json();
				this._isValidating = false;
				if (data.isValid) {
					const { summary, identity, company, hash, timestamp } = data;
					this._verificationData = { summary, identity, company, hash, timestamp };
					this._isValid = true;
					this._validationError = null;
				} else {
					this._verificationData = null;
					this._isValid = false;
					this._validationError = data?.message ? `Error: ${data.message}` : null;
				}
				this._showResults = true;
			} catch (error: any) {
				this._isValidating = false;
				this._isValid = false;
				this._verificationData = null;
				this._validationError = error.message || "An unexpected error occurred during verification.";
				this._showResults = true;
			}
		};
		reader.onerror = () => {
			console.error("File reading error:", reader.error);
			this._isValidating = false;
			this._isValid = false;
			this._selectedFile = null;
			this._validationError = "Error reading the selected file.";
			this._showResults = false;
		};

		reader.readAsText(file);
	}

	private _removeFile() {
		this._selectedFile = null;
		this._isValidating = false;
		this._validationError = null;
		this._verificationData = null;
		this._isValid = null;
		this._showResults = false;
	}

	private close() {
		this._removeFile();
	}

	private _interpolate(template: string, variables: Record<string, any>): string {
		return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, variableName) => {
			return String(variables[variableName] !== undefined ? variables[variableName] : match);
		});
	}

	private getResultSummary(result: VerificationData): TemplateResult<1> {
		const date = result.timestamp
			? new Date(this._verificationData.timestamp).toLocaleString(this.lang, {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit",
					second: "2-digit",
					hour12: true,
					timeZoneName: "short",
			  })
			: this.t("unknownDate");

		const commonVars = {
			hashAlgorithm: result.hash.algorithm,
			hash: result.hash.value,
			date,
		};
		const langKey = this.lang === "de" ? "de" : "en";

		if (result.company?.name && result.identity?.id) {
			const translationKey = "wasAttestedByCompany" as keyof (typeof translations)["en"];
			const template = translations[langKey][translationKey] || translations["en"][translationKey];
			const interpolatedString = this._interpolate(template, {
				...commonVars,
				companyName: result.company.name,
				publicKey: result.identity.id,
			});
			return html`${unsafeHTML(interpolatedString)}`;
		} else {
			const translationKey = "wasAttested" as keyof (typeof translations)["en"];
			const template = translations[langKey][translationKey] || translations["en"][translationKey];
			const interpolatedString = this._interpolate(template, commonVars);
			return html`${unsafeHTML(interpolatedString)}`;
		}
	}

	override render() {
		return html`
			<div class="max-w-6xl content-center mx-auto my-36 px-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
				<div class="col-span-1">
					<h1
						class="leading-tight sm:leading-tight lg:leading-tight xl:leading-tight font-display font-bold mb-5 text-4xl sm:text-5xl lg:text-4xl xl:text-5xl"
					>
						${this.t("verifyCertificate")}
					</h1>
					<p class="text-xl font-bold max-w-[28rem] text-base-06 text-gray-600">${this.t("uploadDescription")}</p>
				</div>
				<div class="lg:col-span-2">${this._showResults ? this.resultTemplate() : this.uploadTemplate()}</div>
			</div>
		`;
	}

	uploadTemplate() {
		const uploaderClasses = {
			"flex": true,
			"flex-col": true,
			"items-center": true,
			"justify-center": true,
			"p-8": true,
			"gap-4": true,
			"border-dashed": true,
			"border-2": true,
			"rounded-2xl": true,
			"cursor-pointer": true,
			"transition-colors": true,
			"duration-200": true,
			"ease-in-out": true,
			"border-gray-300": !this._isFileOver,
			"hover:border-blue-400": !this._isFileOver,
			"bg-blue-50": this._isFileOver,
			"border-blue-500": this._isFileOver,
		};

		return html`
			<div class="w-full">
				<div class="bg-white px-6 py-8 shadow-xl ring-1 ring-gray-900/5 rounded-2xl">
					<!-- Hidden File Input -->
					<input type="file" id="certificateInput" class="hidden" accept="application/json" @change="${this._handleFileChange}" />

					<!-- Drag and Drop Area / Click Trigger -->
					<div
						class=${classMap(uploaderClasses)}
						@dragover="${this._handleDragOver}"
						@dragleave="${this._handleDragLeave}"
						@drop="${this._handleDrop}"
						@click="${() => this.shadowRoot?.getElementById("certificateInput")?.click()}"
						tabindex="0"
						role="button"
						aria-label="${this.t("chooseFile")}"
					>
						<!-- Upload Icon (Placeholder) -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-12 w-12 text-gray-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="1"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
						</svg>

						<div class="text-center font-semibold text-gray-700">
							<span>${this.t("chooseFile")}</span>
							<span class="text-gray-500"> ${this.t("orDrag")}</span>
						</div>

						<div class="pt-8 flex flex-col sm:flex-row w-full upload-footer text-xs text-gray-500 mt-2">
							${this.t("filesSupported")}
							<span class="flex-auto"></span>
							${this.t("neverStored")}
						</div>

						<!-- File Status / Validation Area -->
						${this._selectedFile || this._isValidating || this._validationError
							? html`
									<div
										class="mt-4 p-4 border rounded-lg ${this._validationError ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}"
									>
										<div class="flex items-center gap-3">
											${this._isValidating
												? html`
														<!-- Loader Icon (Placeholder) -->
														<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
														<span class="flex-1 text-sm text-gray-600">${this.t("verifying")}</span>
												  `
												: this._validationError
												? html`
														<!-- Error Icon (Placeholder) -->
														<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
															<path
																fill-rule="evenodd"
																d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
																clip-rule="evenodd"
															/>
														</svg>
														<span class="flex-1 text-sm text-red-700">${this._validationError}</span>
														<button
															@click="${this._removeFile}"
															class="text-gray-500 hover:text-gray-700"
															aria-label="${this.t("removeFile")}"
														>
															<!-- Close Icon (Placeholder) -->
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																stroke-width="2"
															>
																<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
															</svg>
														</button>
												  `
												: this._selectedFile
												? html`
														<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
															<path
																fill-rule="evenodd"
																d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
																clip-rule="evenodd"
															/>
														</svg>
														<span class="flex-1 text-sm text-gray-700 truncate" title="${this._selectedFile.name}"
															>${this._selectedFile.name}</span
														>
														<button
															@click="${this._removeFile}"
															class="text-gray-500 hover:text-gray-700"
															aria-label="${this.t("removeFile")}"
														>
															<!-- Close Icon (Placeholder) -->
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5"
																fill="none"
																viewBox="0 0 24 24"
																stroke="currentColor"
																stroke-width="2"
															>
																<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
															</svg>
														</button>
												  `
												: ""}
										</div>
									</div>
							  `
							: ""}
					</div>
				</div>
			</div>
		`;
	}

	resultTemplate() {
		if (this._isValid && this._verificationData) {
			return html`
				<div class="w-full">
					<div class="bg-white px-6 py-8 shadow-xl ring-1 ring-gray-900/5 rounded-2xl">
						<div class="flex flex-col gap-4 rounded-2xl">
							<h2 class="text-2xl font-semibold">${this.t("certificateNotarized")}</h2>
							<div class="bg-gray-200 rounded-lg p-4 text-sm text-gray-800">${this.getResultSummary(this._verificationData)}</div>
							<div class="rounded-lg border border-gray-300 overflow-hidden">
								<table class="table-auto w-full text-sm">
									<thead class="bg-gray-200 text-left text-gray-700">
										<tr>
											<th colspan="2" class="px-4 py-2 font-semibold text-center">
												${this.t("certificateNo")} ${this._verificationData.summary.identifier}
											</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-gray-200">
										<tr class="bg-white">
											<td class="px-4 py-2 font-medium text-gray-600 w-1/3">${this.t("from")}</td>
											<td class="px-4 py-2 text-gray-800">${this._verificationData.summary.sellerName}</td>
										</tr>
										<tr class="bg-gray-50">
											<td class="px-4 py-2 font-medium text-gray-600">${this.t("for")}</td>
											<td class="px-4 py-2 text-gray-800">${this._verificationData.summary.buyerName}</td>
										</tr>
										<tr class="bg-white">
											<td class="px-4 py-2 font-medium text-gray-600">${this.t("product")}</td>
											<td class="px-4 py-2 text-gray-800">${this._verificationData.summary.productDescription}</td>
										</tr>
										<tr class="bg-gray-50">
											<td class="px-4 py-2 font-medium text-gray-600">${this.t("number")}</td>
											<td class="px-4 py-2 text-gray-800">${this._verificationData.summary.orderNumber}</td>
										</tr>
										<tr class="bg-white">
											<td class="px-4 py-2 font-medium text-gray-600">${this.t("position")}</td>
											<td class="px-4 py-2 text-gray-800">${this._verificationData.summary.orderPosition}</td>
										</tr>
										<tr class="bg-gray-50">
											<td class="px-4 py-2 font-medium text-gray-600">${this.t("deliveryNumber")}</td>
											<td class="px-4 py-2 text-gray-800">${this._verificationData.summary.deliveryNumber}</td>
										</tr>
										<tr class="bg-white">
											<td class="px-4 py-2 font-medium text-gray-600">${this.t("deliveryPosition")}</td>
											<td class="px-4 py-2 text-gray-800">${this._verificationData.summary.deliveryPosition}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="mt-4">
								<button
									class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
									@click="${this.close}"
								>
									${this.t("close")}
								</button>
							</div>
						</div>
					</div>
				</div>
			`;
		} else {
			return html`
				<div class="w-full">
					<div class="bg-white px-6 py-8 shadow-xl ring-1 ring-gray-900/5 rounded-2xl">
						<div class="flex flex-col gap-4 rounded-2xl">
							<div class="flex flex-row gap-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-8 w-8"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="1"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
									/>
								</svg>
								<h2 class="text-2xl font-semibold ">${this.t("certificateNotValid")}</h2>
							</div>
							${this._validationError ? html`<p class="text-sm ">${this._validationError}</p>` : ""}
							<div class="mt-4">
								<button
									class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
									@click="${this.close}"
								>
									${this.t("close")}
								</button>
							</div>
						</div>
					</div>
				</div>
			`;
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"s1seven-verify": S1sevenVerify;
	}
}
