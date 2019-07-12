import * as React from 'react';
import { Form, Input, TextArea, Button } from 'semantic-ui-react';

interface Fields {
  emailAddress?: string;
  label?: string;
  notes?: string;
}

interface Props {
  loading: boolean;
  onSubmit(variables: Object): Promise<void>;
  onClose(): void;
}

export default function EmailAddressCreator({
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
    <div className="create-email-creator">
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
          <label>Email</label>
          <Input
            value={fields.emailAddress}
            onChange={(_, { value }: { value: any }) =>
              setValue('emailAddress', value)
            }
          />
        </Form.Field>
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
        .create-email-creator {
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
