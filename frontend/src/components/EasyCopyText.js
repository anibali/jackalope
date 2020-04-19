import React, { useCallback, useRef } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';


const EasyCopyText = ({ text }) => {
  const ref = useRef();

  const copyToClipboard = useCallback(
    () => {
      // Select the text.
      ref.current.select();
      ref.current.setSelectionRange(0, 99999);
      // Copy selection to clipboard.
      document.execCommand('copy');
    },
    [ref],
  );

  return (
    <InputGroup className="mb-3">
      <FormControl
        aria-label="Game room link"
        ref={ref}
        value={text}
        readOnly
      />
      <InputGroup.Append>
        <Button variant="secondary" onClick={copyToClipboard}>Copy</Button>
      </InputGroup.Append>
    </InputGroup>
  );
};


export default EasyCopyText;
