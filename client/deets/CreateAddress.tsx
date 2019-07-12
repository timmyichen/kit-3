import * as React from 'react';
import { Form, Input, TextArea, Button } from 'semantic-ui-react';

interface Fields {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  label?: string;
  notes?: string;
}

interface Props {
  loading: boolean;
  onSubmit(variables: Object): Promise<void>;
  onClose(): void;
}

export default function AddressCreator({ onSubmit, loading, onClose }: Props) {
  const [fields, setFields] = React.useState<Fields>({});

  const setValue = (field: keyof Fields, value: any) => {
    const updatedFields = fields;
    updatedFields[field] = value;
    setFields(updatedFields);
  };

  return (
    <div className="address-creator">
      <Form>
        <Form.Field required>
          <label>Label</label>
          <Input
            value={fields.label}
            onChange={(_, { value }: { value: any }) =>
              setValue('label', value)
            }
          />
        </Form.Field>
        <Form.Field required>
          <label>Address Line 1</label>
          <Input
            value={fields.addressLine1}
            onChange={(_, { value }: { value: any }) =>
              setValue('addressLine1', value)
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Address Line 2</label>
          <Input
            value={fields.addressLine2}
            onChange={(_, { value }: { value: any }) =>
              setValue('addressLine2', value)
            }
          />
        </Form.Field>
        <Form.Group>
          <Form.Field>
            <label>City</label>
            <Input
              value={fields.city}
              onChange={(_, { value }: { value: any }) =>
                setValue('city', value)
              }
            />
          </Form.Field>
          <Form.Field>
            <label>State / Province / Region</label>
            <Input
              value={fields.state}
              onChange={(_, { value }: { value: any }) =>
                setValue('state', value)
              }
            />
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field>
            <label>Postal / Zip Code</label>
            <Input
              value={fields.postalCode}
              onChange={(_, { value }: { value: any }) =>
                setValue('postalCode', value)
              }
            />
          </Form.Field>
          <Form.Field required>
            <label>Country</label>
            <Input
              value={fields.countryCode}
              onChange={(_, { value }: { value: any }) =>
                setValue('countryCode', value)
              }
            />
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <label>Notes</label>
          <TextArea
            value={fields.notes}
            onChange={(_, { value }: { value: any }) =>
              setValue('notes', value)
            }
          />
        </Form.Field>
      </Form>
      <div className="ctas">
        <Button disabled={loading} onClick={onClose}>
          Close
        </Button>
        <Button
          disabled={loading}
          color="blue"
          onClick={() => onSubmit(fields)}
          type="submit"
        >
          {loading ? 'Creating' : 'Create'}
        </Button>
      </div>
      <style jsx>{`
        .address-creator {
          max-width: 400px;
          margin: 0 auto;
        }
        .ctas {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
