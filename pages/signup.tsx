import * as React from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';

export default () => (
  <div className="signup-wrapper">
    <Form action="/signup" method="POST">
      <Form.Field>
        <label>First Name (Given Name)</label>
        <input name="givenName" placeholder="Name" required />
      </Form.Field>
      <Form.Field>
        <label>Last Name (Family Name)</label>
        <input name="familyName" placeholder="Name" required />
      </Form.Field>
      <Form.Field>
        <label>Username</label>
        <input name="username" placeholder="Name" required />
      </Form.Field>
      <Form.Field>
        <label>Email</label>
        <input name="email" placeholder="Email" required />
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="At least 8 characters"
          required
        />
      </Form.Field>
      <Form.Field>
        <Checkbox label="I agree to the Terms and Conditions" required />
      </Form.Field>
      <Button type="submit">Submit</Button>
    </Form>
    <style jsx>{`
      .signup-wrapper :global(.ui.form) {
        max-width: 400px;
        margin: 50px auto;
      }
    `}</style>
  </div>
);
