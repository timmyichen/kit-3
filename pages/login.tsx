import * as React from 'react';
import { Button, Form } from 'semantic-ui-react';

export default () => (
  <div>
    <Form action="/login" method="POST">
      <Form.Field>
        <label>Email</label>
        <input name="email" placeholder="Email" />
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <input name="password" type="password" placeholder="Password" />
      </Form.Field>
      <Button type="submit">Log in</Button>
    </Form>
    <style jsx>{`
      div {
        max-width: 400px;
        margin: 50px auto;
      }
    `}</style>
  </div>
);
