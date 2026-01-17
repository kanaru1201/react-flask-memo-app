package model

import "errors"

type User struct {
	ID       int
	Username string
	Password string // Hashed password
}

// NewUser creates a new User instance and performs validation.
// It expects the password to be already hashed before being passed.
func NewUser(username, hashedPassword string) (*User, error) {
	user := &User{
		Username: username,
		Password: hashedPassword,
	}
	if err := user.Validate(); err != nil {
		return nil, err
	}
	return user, nil
}

// Validate verifies that the User satisfies domain business rules.
func (u *User) Validate() error {
	if u.Username == "" {
		return errors.New("username cannot be empty")
	}
	if u.Password == "" {
		return errors.New("password hash cannot be empty")
	}
	return nil
}
