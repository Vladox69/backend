const forge = require("node-forge");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
/*
const getP12 = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(
      `Failed to retrieve P12 file: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.arrayBuffer();
  return data;
};

const getXml = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(
      `Failed to retrieve XML file: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.text();
  return data;
};

const sha1Base64 = (txt, encoding = "UTF-8") => {
  const md = forge.md.sha1.create();
  md.update(txt, encoding);
  const hash = md.digest().toHex();
  const buffer = new Buffer.from(hash, "hex");
  const base64 = buffer.toString("base64");
  return base64;
};

const hexToBase64 = (hexStr) => {
  hexStr = hexStr.padStart(hexStr.length + (hexStr.length % 2), "0");
  const bytes = hexStr.match(/.{2}/g).map((byte) => parseInt(byte, 16));
  return btoa(String.fromCharCode(...bytes));
};

const bigIntToBase64 = (bigint) => {
  const hexString = bigint.toString(16);
  const hexPairs = hexString.match(/\w{2}/g);
  const bytes = hexPairs.map((pair) => parseInt(pair, 16));
  const byteString = String.fromCharCode(...bytes);
  const base64 = btoa(byteString);
  const formattedBase64 = base64.match(/.{1,76}/g).join("\n");
  return formattedBase64;
};

const getRandomNumber = (min = 990, max = 9999) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const signXml = async (p12path, p12password, xmlString) => {
  const arraybuffer = await getP12(p12path);
  let xml = await getXml(xmlpath);
  const arraybuffer = p12Buffer.buffer.slice(
    p12Buffer.byteOffset,
    p12Buffer.byteOffset + p12Buffer.byteLength
  );
  let xml = xmlString;
  xml = xml
    .replace(/^\s+/g, " ")
    .trim()
    .replace(/(?<=<\/?\w)(\r?\n|\r\n?)(?=\s|>)/g, "")
    .trim()
    .replace(/(?<=<)\s+/g, "");

  const der = forge.util.decode64(
    forge.util.binary.base64.encode(new Uint8Array(arraybuffer))
  );

  const asn1 = forge.asn1.fromDer(der);
  const p12 = forge.pkcs12.pkcs12FromAsn1(asn1, p12password);

  const pkcs8bags = p12.getBags({
    bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
  });

  const certbags = p12.getBags({
    bagType: forge.pki.oids.certBag,
  });

  const certbag = certbags[forge.oids.certBag];
  const friendlyname = certbag[0].attributes.friendlyName[0];

  let certificate;
  let pkcs8;
  let issuername;

  const cert = certbag.reduce((prev, curr) => {
    const attributes = curr.attributes;
    return attributes.length > prev.cert.extensions.length ? curr : prev;
  });

  const issuerAttrs = cert.cert.issuer.attributes;

  issuername = issuerAttrs
    .reverse()
    .map((attr) => {
      return `${attr.shortName}=${attr.value}`;
    })
    .join(", ");

  if (/BANCO CENTRAL/i.test(friendlyname)) {
    let keys = pkcs8bags[forge.oids.pkcs8ShroudedKeyBag];
    for (let i = 0; i < keys.length; i++) {
      const element = keys[i];
      let friendlyname = element.attributes.friendlyName[0];
      if (/Signing Key/i.test(friendlyname)) {
        pkcs8 = pkcs8bags[forge.oids.pkcs8ShroudedKeyBag][i];
      }
    }
  }

  if (/SECURITY DATA/i.test(friendlyname)) {
    pkcs8 = pkcs8bags[forge.oids.pkcs8ShroudedKeyBag][0];
  }
  certificate = cert.cert;
  const notBefore = certificate.validity["notBefore"];
  const notAfter = certificate.validity["notAfter"];
  const currentDate = new Date();
  if (currentDate < notBefore || currentDate > notAfter) {
    throw new Error("Certificate is not valid");
  }
  let key = pkcs8.key ?? pkcs8.asn1;
  const certificateX509_pem = forge.pki.certificateToPem(certificate);
  let certificateX509 = certificateX509_pem.substring(
    certificateX509_pem.indexOf("\n") + 1,
    certificateX509_pem.indexOf("\n-----END CERTIFICATE-----")
  );
  certificateX509 = certificateX509
    .replace(/\r?\n|\r/g, "")
    .replace(/([^\0]{76})/g, "$1\n");

  const certificateX509_asn1 = forge.pki.certificateToAsn1(certificate);
  const certificateX509_der = forge.asn1.toDer(certificateX509_asn1).getBytes();
  const hash_certificateX509_der = sha1Base64(certificateX509_der);
  const certificateX509_serialNumber = parseInt(certificate.serialNumber, 16);

  const exponent = hexToBase64(key.e.data[0].toString(16));
  const modulus = bigIntToBase64(key.n);

  xml = xml.replace(/\t|\r/g, "");
  const sha1_xml = sha1Base64(
    xml.replace('<?xml version="1.0" encoding="UTF-8"?>', ""),
    "utf8"
  );

  const namespaces =
    'xmlns="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#"';

  const Certificate_number = getRandomNumber();
  const Signature_number = getRandomNumber();
  const Signedproperties_number = getRandomNumber();
  const SignedInfo_number = getRandomNumber();
  const SignedPropertiesID_number = getRandomNumber();
  const Reference_ID_number = getRandomNumber();
  const SignatureValue_number = getRandomNumber();
  const Object_number = getRandomNumber();

  const isoDateTime = currentDate.toISOString().slice(0, 19);
  let SignedProperties = "";
  SignedProperties +=
    '<etsi:SignedProperties Id="Signature' +
    Signature_number +
    "-SignedProperties" +
    Signedproperties_number +
    '">';

  SignedProperties += "<etsi:SignedSignatureProperties>";
  SignedProperties += "<etsi:SigningTime>";
  SignedProperties += isoDateTime;
  SignedProperties += "</etsi:SigningTime>";
  SignedProperties += "<etsi:SigningCertificate>";
  SignedProperties += "<etsi:Cert>";
  SignedProperties += "<etsi:CertDigest>";
  SignedProperties +=
    '<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
  SignedProperties += "</ds:DigestMethod>";
  SignedProperties += "<ds:DigestValue>";
  SignedProperties += hash_certificateX509_der;
  SignedProperties += "</ds:DigestValue>";
  SignedProperties += "</etsi:CertDigest>";
  SignedProperties += "<etsi:IssuerSerial>";
  SignedProperties += "<ds:X509IssuerName>";
  SignedProperties += issuername;
  SignedProperties += "</ds:X509IssuerName>";
  SignedProperties += "<ds:X509SerialNumber>";
  SignedProperties += certificateX509_serialNumber;
  SignedProperties += "</ds:X509SerialNumber>";
  SignedProperties += "</etsi:IssuerSerial>";
  SignedProperties += "</etsi:Cert>";
  SignedProperties += "</etsi:SigningCertificate>";
  SignedProperties += "</etsi:SignedSignatureProperties>";

  SignedProperties += "<etsi:SignedDataObjectProperties>";
  SignedProperties +=
    '<etsi:DataObjectFormat ObjectReference="#Reference-ID' +
    Reference_ID_number +
    '">';
  SignedProperties += "<etsi:Description>";
  SignedProperties += "contenido comprobante";
  SignedProperties += "</etsi:Description>";
  SignedProperties += "<etsi:MimeType>";
  SignedProperties += "text/xml";
  SignedProperties += "</etsi:MimeType>";
  SignedProperties += "</etsi:DataObjectFormat>";
  SignedProperties += "</etsi:SignedDataObjectProperties>";
  SignedProperties += "</etsi:SignedProperties>";

  const sha1_SignedProperties = sha1Base64(
    SignedProperties.replace(
      "<etsi:SignedProperties",
      "<etsi:SignedProperties " + namespaces
    )
  );

  let KeyInfo = "";
  KeyInfo += '<ds:KeyInfo Id="Certificate' + Certificate_number + '">';
  KeyInfo += "\n<ds:X509Data>";
  KeyInfo += "\n<ds:X509Certificate>\n";
  KeyInfo += certificateX509;
  KeyInfo += "\n</ds:X509Certificate>";
  KeyInfo += "\n</ds:X509Data>";
  KeyInfo += "\n<ds:KeyValue>";
  KeyInfo += "\n<ds:RSAKeyValue>";
  KeyInfo += "\n<ds:Modulus>\n";
  KeyInfo += modulus;
  KeyInfo += "\n</ds:Modulus>";
  KeyInfo += "\n<ds:Exponent>\n";
  KeyInfo += exponent;
  KeyInfo += "\n</ds:Exponent>";
  KeyInfo += "\n</ds:RSAKeyValue>";
  KeyInfo += "\n</ds:KeyValue>";
  KeyInfo += "\n</ds:KeyInfo>";

  const sha1_KeyInfo = sha1Base64(
    KeyInfo.replace("<ds:KeyInfo", "<ds:KeyInfo " + namespaces)
  );

  let SignedInfo = "";
  SignedInfo +=
    '<ds:SignedInfo Id="Signature-SignedInfo' + SignedInfo_number + '">';
  SignedInfo +=
    '\n<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315">';
  SignedInfo += "</ds:CanonicalizationMethod>";
  SignedInfo +=
    '\n<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1">';
  SignedInfo += "</ds:SignatureMethod>";
  SignedInfo +=
    '\n<ds:Reference Id="SignedPropertiesID' +
    SignedPropertiesID_number +
    '" Type="http://uri.etsi.org/01903#SignedProperties" URI="#Signature' +
    Signature_number +
    "-SignedProperties" +
    Signedproperties_number +
    '">';
  SignedInfo +=
    '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
  SignedInfo += "</ds:DigestMethod>";
  SignedInfo += "\n<ds:DigestValue>";
  SignedInfo += sha1_SignedProperties;
  SignedInfo += "</ds:DigestValue>";
  SignedInfo += "\n</ds:Reference>";
  SignedInfo += '\n<ds:Reference URI="#Certificate' + Certificate_number + '">';
  SignedInfo +=
    '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
  SignedInfo += "</ds:DigestMethod>";
  SignedInfo += "<ds:DigestValue>";
  SignedInfo += sha1_KeyInfo;
  SignedInfo += "</ds:DigestValue>";
  SignedInfo += "\n</ds:Reference>";
  SignedInfo +=
    '\n<ds:Reference Id="Reference-ID-' +
    Reference_ID_number +
    '" URI="#comprobante">';
  SignedInfo += "\n<ds:Transforms>";
  SignedInfo +=
    '\n<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature">';
  SignedInfo += "</ds:Transform>";
  SignedInfo += "\n</ds:Transforms>";
  SignedInfo +=
    '\n<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1">';
  SignedInfo += "<ds:DigestValue>";
  SignedInfo += "\n</ds:DigestValue>";
  SignedInfo += sha1_xml;
  SignedInfo += "</ds:DigestMethod>";
  SignedInfo += "\n</ds:Reference>";
  SignedInfo += "\n</ds:SignedInfo>";

  const canonicalized_SignedInfo = SignedInfo.replace(
    "<ds:SignedInfo",
    "<ds:SignedInfo " + namespaces
  );

  const md = forge.md.sha1.create();
  md.update(canonicalized_SignedInfo, "utf8");

  const signature = btoa(key.sign(md))
    .match(/.{1,76}/g)
    .join("\n");

  let xades_bes = "";
  xades_bes +=
    "<ds:Signature" + namespaces + ' Id="Signature' + Signature_number + '">';
  xades_bes += "\n" + SignedInfo;
  xades_bes +=
    '\n<ds:SignatureValue Id="SignatureValue' + SignatureValue_number + '">\n';
  xades_bes += signature;
  xades_bes += "\n</ds:SignatureValue>";
  xades_bes += "\n" + KeyInfo;
  xades_bes +=
    '\n<ds:Object Id="Signature' +
    Signature_number +
    "-Object" +
    Object_number +
    '">';
  xades_bes +=
    '<etsi:QualifyingProperties Target="#Signature' + Signature_number + '">';
  xades_bes += SignedProperties;
  xades_bes += "</etsi:QualifyingProperties>";
  xades_bes += "</ds:Object>";
  xades_bes += "</ds:Signature>";

  let signed = xml.replace(/(<[^<]+)$/, xades_bes + "$1");
  return signed;
};
*/
const signXml = async (p12RelativePath, p12Password, xml) => {
  try {

    const payload = {
      P12Url: p12RelativePath,
      Password: p12Password,
      Xml: xml,
    };
    console.log(process.env.SIGN_MICROSERVICE_URL_PROD);
    const response = await axios.post(
      process.env.SIGN_MICROSERVICE_URL_PROD,
      payload,
      { responseType: "arraybuffer" }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error("Error al firmar el XML:", error);
    throw new Error("Error al firmar el XML");
  }
};

module.exports = { signXml };
