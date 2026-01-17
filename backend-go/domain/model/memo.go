package model

import (
	"errors"
	"time"
)

type Memo struct {
	ID        int
	OwnerID   int
	Title     string
	Body      string
	CreatedAt time.Time
}

// NewMemo creates a new Memo instance and performs initial validation.
func NewMemo(ownerID int, title, body string) (*Memo, error) {
	memo := &Memo{
		OwnerID:   ownerID,
		Title:     title,
		Body:      body,
		CreatedAt: time.Now(),
	}
	if err := memo.Validate(); err != nil {
		return nil, err
	}
	return memo, nil
}

// Validate checks if the Memo satisfies domain business rules.
func (m *Memo) Validate() error {
	if m.Body == "" {
		return errors.New("memo body cannot be empty")
	}
	return nil
}
