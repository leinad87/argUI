import {Button, Form} from "react-bootstrap";
import Google from "./Google";
import React, {useState} from "react";
import {useHistory} from 'react-router-dom';

const SheetIPnutForm = () => {

    const [id, setId] = useState('');
    const history = useHistory();
    return (
        <Form>
            <Form.Group controlId="sheet-id">
                <Form.Label>Sheet ID. Puedes sacarla de la URL</Form.Label>
                <Form.Control placeholder="Sheet ID" value={id} onChange={e => setId(e.target.value)}/>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={() => {
                Google.getInstance().sheetId = id;
                history.replace("/");
            }
            }>
                Submit
            </Button>

        </Form>
    );
}

export default SheetIPnutForm;