import * as React from 'react';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { Form, Input, TextArea, Button, Checkbox } from 'semantic-ui-react';
import { AddressDeet } from 'client/types';

interface Fields {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  label?: string;
  notes?: string;
  isPrimary?: boolean;
}

const defaultFields = {
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  countryCode: '',
  label: '',
  notes: '',
  isPrimary: false,
};

const getAddressFields = (address: AddressDeet) => {
  const fields = {
    ...pick(
      // country should be countryCode here
      omit(address, 'country'),
      Object.keys(defaultFields),
    ),
    countryCode: address.country || '',
  };
  return fields;
};

interface Props {
  loading: boolean;
  address?: AddressDeet;
  ctaText?: string;
  isModal?: boolean;
  onSubmit(variables: Object): Promise<void>;
  onClose(): void;
}

export default function AddressCreator({
  onSubmit,
  loading,
  onClose,
  address,
  ctaText,
}: Props) {
  const [fields, setFields] = React.useState<Fields>(
    address ? getAddressFields(address) : defaultFields,
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
        <Form.Field>
          <Checkbox
            label="This is my primary address"
            checked={fields.isPrimary}
            onChange={(_, { checked }: { checked: boolean }) =>
              setValue('isPrimary', checked)
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
          {ctaText || 'Create'}
        </Button>
      </div>
      <style jsx>{`
        .address-creator {
          max-width: 400px;
          margin: 0 auto;
        }
        .address-creator :global(.ctas) {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}
