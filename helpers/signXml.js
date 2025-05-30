const { SignedXml } = require("xml-crypto");
const { DOMParser } = require("xmldom");
const forge = require("node-forge");

/**
 * Firma un XML con certificado .p12
 * @param {string} xmlString - XML como string
 * @param {Buffer} p12Buffer - Certificado en formato .p12
 * @param {string} p12Password - Contraseña del certificado
 * @returns {string} - XML firmado
 */
const signXml = (xmlString, p12Buffer, p12Password) => {
  const p12Asn1 = forge.asn1.fromDer(p12Buffer.toString("binary"), false);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, p12Password);

  const keyObj = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[
    forge.pki.oids.pkcs8ShroudedKeyBag
  ][0].key;
  const certObj = p12.getBags({ bagType: forge.pki.oids.certBag })[
    forge.pki.oids.certBag
  ][0].cert;

  const privateKeyPem = forge.pki.privateKeyToPem(keyObj);
  const certPem = forge.pki.certificateToPem(certObj);

  const sig = new SignedXml();

  // ✅ CORRECTO USO POSICIONAL
  sig.addReference(
    "//*[local-name(.)='factura']",
    ["http://www.w3.org/2000/09/xmldsig#enveloped-signature"],
    "http://www.w3.org/2000/09/xmldsig#sha1"
  );

  sig.signingKey = privateKeyPem;
  sig.signatureAlgorithm = "http://www.w3.org/2000/09/xmldsig#rsa-sha1";
  sig.canonicalizationAlgorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315";

  sig.keyInfoProvider = {
    getKeyInfo: () => `<X509Data></X509Data>`,
  };

  const doc = new DOMParser().parseFromString(xmlString, "application/xml");
  sig.computeSignature(doc);

  return sig.getSignedXml();
};

module.exports = signXml;
