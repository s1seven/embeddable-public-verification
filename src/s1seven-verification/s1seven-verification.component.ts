import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { TailwindElement } from "../shared/tailwind.element";

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

type Hash = {
	value: String;
};

type Identity = {
	id: String;
};

type Company = {
	name: String;
};

const translations = {
	en: {
		verifyCertificate: "Verify Certificate",
		uploadDescription: "Upload a certificate to check the integrity of the data and the authenticity of its originator.",
		chooseFile: "Choose certificate file",
		filesSupported: "Files supported: JSON",
		neverStored: "Uploaded certificates are never stored.",
		certificateNotarized: "Certificate was notarized",
		attestedBy: "The document with the sha256 hash",
		wasAttestedBy: "was attested by",
		withPublicKey: "with the public key",
		on: "on",
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
	},
	de: {
		verifyCertificate: "Zertifikat überprüfen",
		uploadDescription: "Laden Sie ein Zertifikat hoch, um die Integrität der Daten und die Authentizität des Ausstellers zu überprüfen.",
		chooseFile: "Zertifikatsdatei auswählen",
		filesSupported: "Unterstützte Dateien: JSON",
		neverStored: "Hochgeladene Zertifikate werden niemals gespeichert.",
		certificateNotarized: "Zertifikat wurde beglaubigt",
		attestedBy: "Das Dokument mit dem sha256-Hash",
		wasAttestedBy: "wurde beglaubigt von",
		withPublicKey: "mit dem öffentlichen Schlüssel",
		on: "am",
		certificateNo: "Zertifikat Nr.",
		from: "Von",
		for: "Für",
		product: "Produkt",
		number: "Nummer",
		position: "Position",
		deliveryNumber: "Liefernummer",
		deliveryPosition: "Lieferposition",
		close: "Schließen",
		certificateNotValid: "Zertifikat ist nicht gültig",
	},
};

@customElement("s1seven-verify")
export class S1sevenVerify extends TailwindElement("") {
	@property({ type: String, reflect: true })
	lang = "en";

	@property({ type: Boolean })
	certificate = false;

	@property({ type: Boolean })
	isValid = false;

	@property({
		type: Object,
	})
	summary: Summary;

	@property()
	identity: Identity;

	@property()
	company: Company;

	@property()
	hash: Hash;

	@property()
	timestamp: string;

	private t(key: keyof (typeof translations)["en"]) {
		return translations[this.lang === "de" ? "de" : "en"][key] || translations["en"][key];
	}

	override render() {
		return html`
			<div class="max-w-6xl content-center mx-auto my-36 px-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
				<div class="col-span-1">
					<h1
						class="leading-tight  sm:leading-tight lg:leading-tight xl:leading-tight font-display font-bold mb-5 text-4xl sm:text-5xl lg:text-4xl xl:text-5xl"
					>
						${this.t("verifyCertificate")}
					</h1>
					<p class="text-xl font-bold max-w-[28rem] text-base-06 text-gray-600">${this.t("uploadDescription")}</p>
				</div>
				${this.certificate ? this.resultTemplate() : this.uploadTemplate()}
			</div>
		`;
	}

	uploadTemplate() {
		return html`
			<div class="flex flex-row justify-center lg:col-span-2">
				<div class="w-full">
					<div class="bg-white px-6 p-8 shadow-xl ring-1 ring-gray-900/5 rounded-2xl ng-star-inserted">
						<div class="flex flex-col justify-center items-center gap-4 border-dashed border-2 rounded-2xl">
							<div class="p-4 tui-text_body-xl text-center font-bold tui-space_vertical-1 upload-body">
								<span> ${this.t("chooseFile")} </span>
							</div>

							<input type="file" id="certificate" name="certificate" accept="application/json" @change="${this._handleFileUpload}" />

							<div class="p-4 flex flex-col sm:flex-row w-full upload-footer text-gray-600 text-xs">
								${this.t("filesSupported")}
								<span class="flex-auto"></span>
								${this.t("neverStored")}
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	resultTemplate() {
		if (this.isValid) {
			return html`
				<div class="flex flex-row lg:col-span-2">
					<div class="w-full">
						<div class="bg-white px-6 p-8 shadow-xl ring-1 ring-gray-900/5 rounded-2xl ng-star-inserted">
							<div class="flex flex-col gap-4 rounded-2xl">
								<h1>${this.t("certificateNotarized")}</h1>
								<div class="bg-gray-400 rounded-2xl p-4">
									${this.t("attestedBy")} <b>${this.hash.value}</b> ${this.t("wasAttestedBy")} <b>${this.company.name}</b> ${this.t(
										"withPublicKey"
									)}
									${this.identity.id} ${this.t("on")} ${this.timestamp}.
								</div>
								<div class="rounded-2xl bg-white border-gray-500 border-2">
									<table class="table-auto w-full">
										<thead class="bg-gray-500">
											<tr>
												<th>${this.t("certificateNo")} ${this.summary.identifier}</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>${this.t("from")}</td>
												<td>${this.summary.sellerName}</td>
											</tr>
											<tr>
												<td>${this.t("for")}</td>
												<td>${this.summary.buyerName}</td>
											</tr>
											<tr>
												<td>${this.t("product")}</td>
												<td>${this.summary.productDescription}</td>
											</tr>
											<tr>
												<td>${this.t("number")}</td>
												<td>${this.summary.orderNumber}</td>
											</tr>
											<tr>
												<td>${this.t("position")}</td>
												<td>${this.summary.orderPosition}</td>
											</tr>
											<tr>
												<td>${this.t("deliveryNumber")}</td>
												<td>${this.summary.deliveryNumber}</td>
											</tr>
											<tr>
												<td>${this.t("deliveryPosition")}</td>
												<td>${this.summary.deliveryPosition}</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div>
									<button class="rounded-lg border-gray-300 border-2 p-2" @click="${this.close}">${this.t("close")}</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			`;
		} else {
			return html`
				<div class="flex flex-row lg:col-span-2">
					<div class="w-full">
						<div class="bg-white px-6 p-8 shadow-xl ring-1 ring-gray-900/5 rounded-2xl ng-star-inserted">
							<div class="flex flex-col gap-4 rounded-2xl">
								<h1>${this.t("certificateNotValid")}</h1>
								<div>
									<button class="rounded-lg border-gray-300 border-2 p-2" @click="${this.close}">${this.t("close")}</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			`;
		}
	}

	private close() {
		this.certificate = false;
		this.isValid = false;
		this.certificate = null;
		this.summary = null;
		this.identity = null;
		this.company = null;
		this.hash = null;
		this.timestamp = null;
	}

	private _handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			const reader = new FileReader();
			reader.onload = async () => {
				const fileContent = reader.result;

				const response = await fetch("https://app.s1seven.com/api/certificates/verify?mode=test", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: fileContent,
				});

				// TODO: refactor properties
				const data = await response.json();
				this.isValid = data.isValid;
				this.certificate = true;
				this.summary = data.summary;
				this.identity = data.identity;
				this.company = data.company;
				this.hash = data.hash;
				this.timestamp = data.timestamp;
			};
			reader.readAsText(file);
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"s1seven-verify": S1sevenVerify;
	}
}
