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

type Response = {};

@customElement("s1seven-verify")
export class S1sevenVerify extends TailwindElement("") {
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

	override render() {
		return html`
			<div class="max-w-6xl content-center mx-auto my-36 px-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
				<div class="col-span-1">
					<h1
						class="leading-tight  sm:leading-tight lg:leading-tight xl:leading-tight font-display font-bold mb-5 text-4xl sm:text-5xl lg:text-4xl xl:text-5xl"
					>
						Verify Certificate
					</h1>
					<p class="text-xl font-bold max-w-[28rem] text-base-06 text-gray-600">
						Upload a certificate to check the integrity of the data and the authenticity of its originator.
					</p>
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
								<span> Choose certificate file </span>
							</div>

							<input type="file" id="certificate" name="certificate" accept="application/json" @change="${this._handleFileUpload}" />

							<div class="p-4 flex flex-col sm:flex-row w-full upload-footer text-gray-600 text-xs">
								Files supported: JSON
								<span class="flex-auto"></span>
								Uploaded certificates are never stored.
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
								<h1>Certificate was notarized</h1>
								<div class="bg-gray-400 rounded-2xl p-4">
									The document with the sha256 hash <b>${this.hash.value}</b> was attested by <b>${this.company.name}</b> with the public
									key ${this.identity.id} on ${this.timestamp}.
								</div>
								<div class="rounded-2xl bg-white border-gray-500 border-2">
									<table class="table-auto w-full">
										<thead class="bg-gray-500">
											<tr>
												<th>Certificate no. ${this.summary.identifier}</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>From</td>
												<td>${this.summary.sellerName}</td>
											</tr>
											<tr>
												<td>For</td>
												<td>${this.summary.buyerName}</td>
											</tr>
											<tr>
												<td>Product</td>
												<td>${this.summary.productDescription}</td>
											</tr>
											<tr>
												<td>Number</td>
												<td>${this.summary.orderNumber}</td>
											</tr>
											<tr>
												<td>Position</td>
												<td>${this.summary.orderPosition}</td>
											</tr>
											<tr>
												<td>Delivery number</td>
												<td>${this.summary.deliveryNumber}</td>
											</tr>
											<tr>
												<td>Delivery position</td>
												<td>${this.summary.deliveryPosition}</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div>
									<button class="rounded-lg border-gray-300 border-2 p-2" @click="${this.close}">Close</button>
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
								<h1>Certificate is not valid</h1>
								<div>
									<button class="rounded-lg border-gray-300 border-2 p-2" @click="${this.close}">Close</button>
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
