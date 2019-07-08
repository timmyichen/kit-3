import * as React from 'react';
import { Form, Input, TextArea, Button } from 'semantic-ui-react';

interface Fields {
  emailAddress?: string;
  label?: string;
  notes?: string;
}

interface Props {
  onSubmit(variables: Object): Promise<void>;
  loading: boolean;
}

export default function EmailAddressCreator({ onSubmit, loading }: Props) {
  const [fields, setFields] = React.useState<Fields>({});

  const setValue = (field: keyof Fields, value: any) => {
    const updatedFields = fields;
    updatedFields[field] = value;
    setFields(updatedFields);
  };

  return (
    <div className="create-email-creator">
      <Form>
        <Form.Field>
          <label>Label</label>
          <Input
            value={fields.label}
            onChange={(_, { value }: { value: any }) =>
              setValue('label', value)
            }
          />
        </Form.Field>
        <Form.Field>
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
      <div className="cta">
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
      `}</style>
    </div>
  );
}
