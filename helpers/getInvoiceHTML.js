const getInvoiceHTML = ({ businessName, customerName, total, documentNumber }) => `
  <div style="font-family: Arial, sans-serif; padding: 30px; color: #4B2994; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
      
      <img src="https://res.cloudinary.com/dzldck9ai/image/upload/v1652202606/variedades_david_logo.png" alt="Logo" style="width: 120px; margin-bottom: 20px;" />
      
      <p style="margin: 0; font-size: 14px;">HA RECIBIDO UNA FACTURA DE</p>
      <h2 style="margin: 5px 0 20px 0; color: #4B2994;">${businessName}</h2>
      
      <img src="https://cdn-icons-png.flaticon.com/512/3314/3314607.png" alt="Factura" style="width: 80px; margin: 10px auto;" />
      
      <h3 style="margin-top: 20px;">Estimado Cliente</h3>
      <p style="margin: 5px 0; font-size: 16px;">${customerName}</p>
      <p style="margin: 0 0 30px 0; font-size: 14px;">HA RECIBIDO UNA FACTURA ELECTRÓNICA</p>
      
      <table style="width: 100%; font-size: 15px; margin-top: 20px; text-align: left;">
        <tr>
          <td style="padding: 10px 0;"><strong>💰 Por el valor de:</strong></td>
          <td style="text-align: right; font-weight: bold;">$${total}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0;"><strong>🏢 Emitida por:</strong></td>
          <td style="text-align: right;">${businessName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0;"><strong>📄 Nro de Documento:</strong></td>
          <td style="text-align: right; font-weight: bold;">${documentNumber}</td>
        </tr>
      </table>

      <p style="margin-top: 40px; font-size: 13px; color: #999;">Gracias por su preferencia. Si tiene alguna duda, no dude en contactarnos.</p>
    </div>
  </div>
`;

module.exports = getInvoiceHTML;