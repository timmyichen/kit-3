import * as React from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';
import * as axios from 'axios';

export default () => (
  <div>
    <Form action="/signup" method="POST">
      <Form.Field>
        <label>Name</label>
        <input name="name" placeholder="Name" required />
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
    <style jsx>{``}</style>
  </div>
);
