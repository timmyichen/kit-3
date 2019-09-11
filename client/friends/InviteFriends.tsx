import * as React from 'react';
import { useInviteUserToKitMutation } from 'generated/generated-types';
import useMessages from 'client/hooks/useMessages';
import { Form, Input, Button } from 'semantic-ui-react';
import { isEmail } from 'validator';

function InviteFriends() {
  const inviteFriend = useInviteUserToKitMutation();
  const { showConfirm, showError } = useMessages({ length: 4000 });
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const onInvite = async () => {
    if (!isEmail(email)) {
      showError('Invalid email');

      return;
    }

    setLoading(true);

    try {
      await inviteFriend({ variables: { email } });
    } catch (e) {
      showError(e.message);
      setLoading(false);

      return;
    }

    setLoading(false);
    showConfirm(`We sent an invite email to ${email}!`);
    setEmail('');
  };

  return (
    <div className="invite-friends">
      <Form>
        <p>
          This will send them an email with an invitation link. If they accept
          and register with your link, you will automatically become friends.
        </p>
        <Form.Field>
          <label>Email</label>
          <Input
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
            placeholder="Your friend's email"
            disabled={loading}
          />
        </Form.Field>
        <Button type="submit" positive disabled={loading} onClick={onInvite}>
          Invite
        </Button>
      </Form>
      <style jsx>{`
        .invite-friends {
          padding: 30px;
        }
        .invite-friends :global(form) {
          max-width: 400px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}

export default InviteFriends;
