import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FileNameTool = () => {
  const [filename, setFilename] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  
  const [semestergruppe, setSemestergruppe] = useState('A05');
  const [paragraf, setParagraf] = useState('');
  const [docNr, setDocNr] = useState('');
  const [dokumententyp, setDokumententyp] = useState('');
  const [dokumentenname, setDokumentenname] = useState('');
  const [version, setVersion] = useState('');
  const [dateityp, setDateityp] = useState('');
  
  const [isParagraph10, setIsParagraph10] = useState(false);
  const [bgNr, setBgNr] = useState('');
  const [etNr, setEtNr] = useState('');
  
  const [generatedFilename, setGeneratedFilename] = useState('');

  const dokumententypen = [
    'BRIEFE', 'PROJEK', 'DATBNK', 'R.E.D.', 'SPEZIF', 'VORLAG', 'KONZEP', 'ENTWUR', 
    'BESCHR', 'PROTOK', 'BERECH', 'SNLIST', 'S-ETEF', 'S-ETFZ', 'S-ETNZ', 'S-ROZE', 
    'S-ROKA', 'S-BGEF', 'S-BGFZ', 'S-BGNZ', 'ZEI-BG', 'ZEI-ET', 'ZEI-RO', 'MOD-BG', 
    'MOD-ET', 'MOD-RO', 'KATALG', 'SONSTG'
  ];

  const dokumententypenP10 = [...dokumententypen];

  const validateFilename = (name) => {
    const errors = [];
    const regex = /^(ADD)?#([A-Za-z0-9]{1,3})#(P[0-9]{2}\.[0-9]{2})#([0-9]{5})#([A-Z]{6})\.([A-Za-z0-9-]+)#(V[0-9]{2})\.(pdf|zip|docx|CATPart|CATDrawing)$/;
    
    if (!regex.test(name)) {
      errors.push('Dateiname entspricht nicht dem vorgegebenen Format.');
    } else {
      const parts = name.split('#');
      
      if (!/^[A-Za-z0-9]{1,3}$/.test(parts[1])) {
        errors.push('Ungültige Semestergruppe.');
      }

      if (!/^P[0-9]{2}\.[0-9]{2}$/.test(parts[2])) {
        errors.push('Ungültiger Paragraf.');
      }

      if (!/^[0-9]{5}$/.test(parts[3])) {
        errors.push('Ungültige Lokale ID.');
      }

      if (!dokumententypen.includes(parts[4].split('.')[0])) {
        errors.push('Ungültiger Dokumententyp.');
      }

      if (!/^V[0-9]{2}$/.test(parts[5].split('.')[0])) {
        errors.push('Ungültige Version.');
      }
    }

    setIsValid(errors.length === 0);
    setErrorMessages(errors);
  };

  const generateFilename = () => {
    let lokaleID = '';
    if (isParagraph10) {
      const dokTypZ = getDokTypZ(dokumententyp);
      lokaleID = `${bgNr}${etNr}0${dokTypZ}`;
    } else {
      const paragrafNr = paragraf.replace('.', '')[0] + paragraf.replace('.', '')[2];
      lokaleID = `${docNr}${paragrafNr}`;
    }

    let generated = '';
    if (dateityp !== 'pdf' && dateityp !== 'zip') {
      generated += 'ADD';
    }
    
    generated += `#${semestergruppe}#P${paragraf}#${lokaleID}#${dokumententyp}.${dokumentenname}#V${version}.${dateityp}`;
    
    setGeneratedFilename(generated);
  };

  const getDokTypZ = (typ) => {
    switch(typ) {
      case 'ZEI-ET': return '3';
      case 'KATALG': return '4';
      case 'ZEI-BG': return '6';
      default: return '0';
    }
  };

  const validateInput = (value, regex, errorMessage) => {
    if (!regex.test(value)) {
      return errorMessage;
    }
    return '';
  };

  useEffect(() => {
    validateFilename(filename);
  }, [filename]);

  useEffect(() => {
    setIsParagraph10(paragraf.startsWith('10'));
  }, [paragraf]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dateinamen-Tool</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Dateinamen-Validator</h2>
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Geben Sie den Dateinamen ein"
        />
        {filename && (
          <Alert className={`mt-2 ${isValid ? 'bg-green-100' : 'bg-red-100'}`}>
            <AlertDescription>
              {isValid ? 'Dateiname ist gültig.' : errorMessages.join(' ')}
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Dateinamen-Generator</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Semestergruppe</label>
            <input
              type="text"
              value={semestergruppe}
              onChange={(e) => setSemestergruppe(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
              placeholder="z.B. A05"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Paragraf</label>
            <input
              type="text"
              value={paragraf}
              onChange={(e) => setParagraf(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
              placeholder="z.B. 01.01"
            />
            {validateInput(paragraf, /^[0-9]{2}\.[0-9]{2}$/, 'Ungültiges Paragraf-Format.') && (
              <p className="text-red-500 text-xs mt-1">Ungültiges Paragraf-Format.</p>
            )}
          </div>
          {!isParagraph10 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">DOC-NR</label>
              <input
                type="text"
                value={docNr}
                onChange={(e) => setDocNr(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
                placeholder="z.B. 00"
              />
              {validateInput(docNr, /^[0-9]{2}$/, 'Ungültige DOC-NR.') && (
                <p className="text-red-500 text-xs mt-1">Ungültige DOC-NR.</p>
              )}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">BG-NR</label>
                <input
                  type="text"
                  value={bgNr}
                  onChange={(e) => setBgNr(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="z.B. 0"
                />
                {validateInput(bgNr, /^[0-9]$/, 'Ungültige BG-NR.') && (
                  <p className="text-red-500 text-xs mt-1">Ungültige BG-NR.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ET-NR</label>
                <input
                  type="text"
                  value={etNr}
                  onChange={(e) => setEtNr(e.target.value)}
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="z.B. 01"
                />
                {validateInput(etNr, /^[0-9]{2}$/, 'Ungültige ET-NR.') && (
                  <p className="text-red-500 text-xs mt-1">Ungültige ET-NR.</p>
                )}
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Dokumententyp</label>
            <Select onValueChange={setDokumententyp} value={dokumententyp}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wählen Sie einen Dokumententyp" />
              </SelectTrigger>
              <SelectContent>
                {(isParagraph10 ? dokumententypenP10 : dokumententypen).map((typ) => (
                  <SelectItem key={typ} value={typ}>{typ}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dokumentenname</label>
            <input
              type="text"
              value={dokumentenname}
              onChange={(e) => setDokumentenname(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
              placeholder="z.B. Projektplan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Version</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
              placeholder="z.B. 01"
            />
            {validateInput(version, /^[0-9]{2}$/, 'Ungültiges Versions-Format.') && (
              <p className="text-red-500 text-xs mt-1">Ungültiges Versions-Format.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dateityp</label>
            <input
              type="text"
              value={dateityp}
              onChange={(e) => setDateityp(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
              placeholder="z.B. pdf"
            />
          </div>
        </div>
        <button
          onClick={generateFilename}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Dateinamen generieren
        </button>
        {generatedFilename && (
          <Alert className="mt-2 bg-blue-100">
            <AlertDescription>{generatedFilename}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default FileNameTool;
