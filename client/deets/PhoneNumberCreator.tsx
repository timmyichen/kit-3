import * as React from 'react';
import pick from 'lodash/pick';
import { Form, Input, TextArea, Button, Checkbox } from 'semantic-ui-react';
import { PhoneNumberDeet } from 'client/types';

interface Fields {
  countryCode?: string;
  phoneNumber?: string;
  label?: string;
  notes?: string;
  isPrimary?: boolean;
}

const defaultFields = {
  countryCode: '',
  phoneNumber: '',
  label: '',
  notes: '',
  isPrimary: false,
};

const getPhoneFields = (phone: PhoneNumberDeet) =>
  pick(phone, Object.keys(defaultFields));

interface Props {
  loading: boolean;
  phone?: PhoneNumberDeet;
  ctaText?: string;
  isModal?: boolean;
  onClose(): void;
  onSubmit(variables: Object): Promise<void>;
}

export default function PhoneNumberCreator({
  onSubmit,
  loading,
  onClose,
  phone,
  ctaText,
}: Props) {
  const [fields, setFields] = React.useState<Fields>(
    phone ? getPhoneFields(phone) : defaultFields,
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
        <Form.Field>
          <Checkbox
            label="This is my primary phone number"
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
