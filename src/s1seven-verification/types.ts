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

enum HashAlgorithm {
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

export interface VerificationData {
	summary: Summary;
	identity?: Identity;
	company?: Company;
	hash: Hash;
	timestamp: string;
}
