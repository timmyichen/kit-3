import * as React from 'react';
import { Form, Input, TextArea, Button } from 'semantic-ui-react';

interface Fields {
  countryCode?: string;
  phoneNumber?: string;
  label?: string;
  notes?: string;
}

interface Props {
  loading: boolean;
  onClose(): void;
  onSubmit(variables: Object): Promise<void>;
}

export default function PhoneNumberCreator({
  onSubmit,
  loading,
  onClose,
}: Props) {
  const [fields, setFields] = React.useState<Fields>({});

  const setValue = (field: keyof Fields, value: any) => {
    const updatedFields = fields;
    updatedFields[field] = value;
    setFields(updatedFields);
  };

  return (
    <div className="phone-number-creator">
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

        <Form.Group>
          <Form.Field width="4">
            <label>Country</label>
            <Input
              value={fields.countryCode}
              onChange={(_, { value }: { value: any }) =>
                setValue('countryCode', value)
              }
            />
          </Form.Field>
          <Form.Field width="12" required>
            <label>Number</label>
            <Input
              value={fields.phoneNumber}
              onChange={(_, { value }: { value: any }) =>
                setValue('phoneNumber', value)
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
        >
          {loading ? 'Creating' : 'Create'}
        </Button>
      </div>
      <style jsx>{`
        .phone-number-creator {
          max-width: 300px;
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
