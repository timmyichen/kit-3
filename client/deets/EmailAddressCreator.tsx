import * as React from 'react';
import pick from 'lodash/pick';
import { Form, Input, TextArea, Button, Checkbox } from 'semantic-ui-react';
import { EmailAddressDeet } from 'client/types';

interface Fields {
  emailAddress?: string;
  label?: string;
  notes?: string;
  isPrimary?: boolean;
}

const defaultFields = {
  emailAddress: '',
  label: '',
  notes: '',
  isPrimary: false,
};

const getEmailFields = (email: EmailAddressDeet) =>
  pick(email, Object.keys(defaultFields));

interface Props {
  loading: boolean;
  email?: EmailAddressDeet;
  ctaText?: string;
  isModal?: boolean;
  onSubmit(variables: Object): Promise<void>;
  onClose(): void;
}

export default function EmailAddressCreator({
  onSubmit,
  loading,
  onClose,
  email,
  ctaText,
}: Props) {
  const [fields, setFields] = React.useState<Fields>(
    email ? getEmailFields(email) : defaultFields,
  );

  const setValue = (field: keyof Fields, value: any) => {
    const updatedFields = fields;
    updatedFields[field] = value;
    setFields(prevState => ({
      ...prevState,
      ...updatedFields,
    }));
  };

  return (
    <div className="create-email-creator">
      <Form>
        <Form.Field required>
          <label>Label</label>
          <Input
            value={fields.label}
            onChange={(_, { value }: { value: string }) =>
              setValue('label', value)
            }
          />
        </Form.Field>
        <Form.Field required>
          <label>Email</label>
          <Input
            value={fields.emailAddress}
            onChange={(_, { value }: { value: string }) =>
              setValue('emailAddress', value)
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Notes</label>
          <TextArea
            value={fields.notes}
            onChange={(_, { value }: { value: string }) =>
              setValue('notes', value)
            }
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            label="This is my primary email address"
            checked={fields.isPrimary}
            onChange={(_, { checked }: { checked: boolean }) =>
              setValue('isPrimary', checked)
            }
          />
        </Form.Field>
      </Form>
      <div className="ctas">
        <Button disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          color="blue"
          onClick={() => onSubmit(fields)}
        >
          {ctaText || 'Create'}
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
